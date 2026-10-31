package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprRelateReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplAddReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplEditRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprWriteService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.apr.service.AprStampApplService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V14 날인신청 탭을 asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprStampApplService.class, AprApprDetailService.class, AprApprWriteService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprStampApplDbTest {

    @Autowired AprStampApplService service;
    @Autowired AprApprWriteService write;
    @Autowired JdbcTemplate jdbc;

    private static final long ME = 29035L;
    private static final long OTHER = 29049L;
    private static final long SIMPLE = 202609229873969L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 새_문서에서도_줄을_그_자리에서_넣고_지운다() {
        long id = write.nextApprId();
        long stamp = jdbc.queryForObject("select apr10_stamp_id from apr10_stamp limit 1", Long.class);
        Long a = service.add(user(ME), id, new AprStampApplAddReq("1", stamp, 2L, null));
        service.add(user(ME), id, new AprStampApplAddReq("2", 28000L, 1L, null));
        service.add(user(ME), id, new AprStampApplAddReq("3", stamp, 3L, true));
        AprStampApplEditRes res = service.get(user(ME), id);
        assertThat(res.rows()).hasSize(3);
        assertThat(res.locked()).isFalse();
        assertThat(jdbc.queryForObject("select apr16_stamp_out_yn from apr16_stamp_doc where apr16_appr_id = ? and apr16_appl_type = '3'", String.class, id)).isEqualTo("true");
        assertThat(jdbc.queryForObject("select apr16_doc_appl_qty from apr16_stamp_doc where apr16_stamp_doc_id = ?", Long.class, a)).isEqualTo(2L);

        service.delete(user(ME), id, a);
        assertThat(service.get(user(ME), id).rows()).hasSize(2);
    }

    @Test
    void 입력_검사_메시지는_원본_그대로() {
        long id = write.nextApprId();
        assertThatThrownBy(() -> service.add(user(ME), id, new AprStampApplAddReq("2", null, 1L, null))).hasMessageContaining("대표명의를 선택해주세요");
        assertThatThrownBy(() -> service.add(user(ME), id, new AprStampApplAddReq("1", null, 1L, null))).hasMessageContaining("인감을 선택해주세요");
        assertThatThrownBy(() -> service.add(user(ME), id, new AprStampApplAddReq("1", 1L, 0L, null))).hasMessageContaining("신청매수를 입력해주세요");
        assertThatThrownBy(() -> service.add(user(ME), id, new AprStampApplAddReq("3", 1L, null, null))).hasMessageContaining("날인부수를 입력해주세요");
    }

    @Test
    void 저장하면_제공처_목적_비고가_줄에_쓰이고_남의_문서는_거절() {
        long id = write.nextApprId();
        long stamp = jdbc.queryForObject("select apr10_stamp_id from apr10_stamp limit 1", Long.class);
        service.add(user(ME), id, new AprStampApplAddReq("1", stamp, 1L, null));
        Long classTreeId = jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, SIMPLE);
        var res = write.save(user(ME), id, new AprApprSaveReq("save", classTreeId, null, "날인 시험", "<p>본문</p>", null, LocalDateTime.of(2026, 11, 2, 0, 0), LocalDateTime.of(2026, 10, 31, 0, 0),
                null, null, null, "20", null, null, null, null, null, false, List.of(new AprApprSaveStepReq(null, "00", "001", null, ME, "false", null)),
                new AprApprRelateReq(null, null, null, null, null, new AprApprRelateReq.StampDoc("제공처A", "목적B", "비고C"))));
        assertThat(res.ok()).as(res.message()).isTrue();
        assertThat(service.get(user(ME), id).meta().provideCo()).isEqualTo("제공처A");
        assertThat(service.get(user(ME), id).meta().note()).isEqualTo("비고C");
        // 남의 임시저장 문서에는 더할 수 없다
        assertThatThrownBy(() -> service.add(user(OTHER), id, new AprStampApplAddReq("1", stamp, 1L, null))).isInstanceOf(RuntimeException.class);
    }
}
