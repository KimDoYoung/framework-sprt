package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileStampReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveRow;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprWriteService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.apr.service.AprRelateEditService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V10 연관법규 편집·결재완료후 첨부·첨부 있는 임시저장 삭제를 asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprRelateEditService.class, AprApprDetailService.class, AprApprWriteService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprRelateEditDbTest {

    @Autowired AprRelateEditService service;
    @Autowired AprApprWriteService write;
    @Autowired JdbcTemplate jdbc;

    /** 결재 전(10) 문서, 상신자 28656, 연관법규 여러 줄 */
    private static final long ING = 70693L;
    private static final long REG = 29049L;
    /** 결재완료(30) 문서, 상신자 29035, 결재완료후 파일 1개(202409031964771) */
    private static final long DONE = 202409031964769L;
    /** 새 줄로 넣을 법규(ics01 분류 ID = sch03_info_id)와 그 기한 */
    private static final long LAW = 202207010256302L;
    private static final long DEADLINE = 202207010256303L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험수정자").roles(List.of("ROLE_USER")).build();
    }

    private static AprRelateIcsSaveRow keep(AprRelateIcsRow r, LocalDate close) {
        return new AprRelateIcsSaveRow(r.relateIcsId(), r.classTreeId(), r.deadlineId(), r.standCode(), r.standDate(), close);
    }

    private int count(long apprId) {
        return jdbc.queryForObject("select count(*) from apr20_relate_ics where apr20_appr_id = ?", Integer.class, apprId);
    }

    @Test
    void 연관법규_저장은_알림을_남기고_줄을_더하고_고치고_지운다() {
        List<AprRelateIcsRow> before = service.getRelateIcs(user(REG), ING);
        assertThat(before.size()).isGreaterThanOrEqualTo(2);
        LocalDate close = LocalDate.of(2026, 12, 31);

        List<AprRelateIcsSaveRow> rows = new ArrayList<>();
        rows.add(keep(before.get(0), close));                                          // 마감일 고침
        rows.add(new AprRelateIcsSaveRow(null, LAW, DEADLINE, "10", null, close));     // 새 줄
        int notices = jdbc.queryForObject("select count(*) from bbs02_notice where bbs02_title = '상신문서 연관법규 변동알림'", Integer.class);

        assertThat(service.save(user(REG), ING, new AprRelateIcsSaveReq(rows, List.of(before.get(1).relateIcsId())))).isTrue();

        List<AprRelateIcsRow> after = service.getRelateIcs(user(REG), ING);
        String raw = "raw=" + jdbc.queryForList("select apr20_relate_ics_id, apr20_class_tree_id, apr20_deadline_id, apr20_close_date, apr20_stand_cd from apr20_relate_ics where apr20_appr_id = " + ING) + " before=" + before.stream().map(AprRelateIcsRow::relateIcsId).toList();
        assertThat(after).as(raw).hasSize(before.size());   // N - 1(삭제) + 1(추가)
        assertThat(after).anyMatch(r -> r.relateIcsId().equals(before.get(0).relateIcsId()) && close.equals(r.closeDate()));
        assertThat(after).anyMatch(r -> r.classTreeId().equals(LAW) && close.equals(r.closeDate()) && "10".equals(r.standCode()));
        assertThat(after).noneMatch(r -> r.relateIcsId().equals(before.get(1).relateIcsId()));
        assertThat(jdbc.queryForObject("select count(*) from bbs02_notice where bbs02_title = '상신문서 연관법규 변동알림'", Integer.class)).isEqualTo(notices + 1);
        assertThat(jdbc.queryForObject("select count(*) from bbs03_target t join bbs02_notice n on n.bbs02_notice_id = t.bbs03_notice_id where n.bbs02_title = '상신문서 연관법규 변동알림' and t.bbs03_person_id = ?", Integer.class, REG)).isGreaterThanOrEqualTo(1);
    }

    @Test
    void 마감일_검사와_변경없음과_완료문서() {
        List<AprRelateIcsRow> before = service.getRelateIcs(user(REG), ING);
        // 수시가 아닌 줄은 마감일이 있어야 한다
        assertThatThrownBy(() -> service.save(user(REG), ING, new AprRelateIcsSaveReq(List.of(new AprRelateIcsSaveRow(null, LAW, DEADLINE, null, null, null)), List.of()))).hasMessageContaining("마감일을 입력해주세요");
        // 남은 줄도 지운 줄도 없으면 아무것도 하지 않는다
        assertThat(service.save(user(REG), ING, new AprRelateIcsSaveReq(List.of(), List.of()))).isFalse();
        assertThat(service.getRelateIcs(user(REG), ING)).hasSize(before.size());
        // 결재완료 문서는 못 바꾼다
        assertThatThrownBy(() -> service.save(user(29035L), DONE, new AprRelateIcsSaveReq(List.of(), List.of(1L)))).hasMessageContaining("결재가 완료된 문서는 연관법규 추가/삭제가 불가능합니다");
        // 남의 문서 줄 번호는 거절
        assertThatThrownBy(() -> service.save(user(REG), ING, new AprRelateIcsSaveReq(List.of(new AprRelateIcsSaveRow(1L, LAW, DEADLINE, null, null, LocalDate.now())), List.of()))).isInstanceOf(RuntimeException.class);
    }

    @Test
    void 마감일_계산과_새_줄_정보() {
        AprRelateIcsRow info = service.getInfo(LAW, DEADLINE);
        assertThat(info.classTreeFullName()).isNotBlank();
        assertThat(info.relatedLaw()).isNull();
        assertThat(service.getCloseDate(user(REG), DEADLINE, LocalDate.of(2026, 10, 31))).isNotNull();
    }

    @Test
    void 결재완료후_첨부파일은_인감날인본을_표시한다() {
        List<AprAfterFileRes> files = service.getAfterFiles(user(29035L), DONE);
        assertThat(files).hasSize(1);
        assertThat(files.get(0).stampYn()).isFalse();
        service.saveAfterFiles(user(29035L), DONE, new AprAfterFileStampReq(List.of(new AprAfterFileStampReq.Item(files.get(0).fileId(), true))));
        assertThat(service.getAfterFiles(user(29035L), DONE).get(0).stampYn()).isTrue();
    }

    @Test
    void 첨부파일이_있는_임시저장_문서도_지우고_실제_파일도_지운다() throws Exception {
        long classTree = jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = 202609229873969", Long.class);
        long id = write.nextApprId();
        List<AprApprSaveStepReq> steps = List.of(new AprApprSaveStepReq(null, "00", "001", null, 29035L, "false", null), new AprApprSaveStepReq(null, "10", "002", null, 202312071648256L, "false", null));
        AprApprWriteRes saved = write.save(user(29035L), id, new AprApprSaveReq("save", classTree, null, "첨부 시험", "<p>본문</p>", null, LocalDateTime.of(2026, 11, 2, 0, 0), LocalDateTime.of(2026, 10, 31, 0, 0),
                null, null, null, "20", null, null, null, null, "의견", false, steps));
        assertThat(saved.ok()).isTrue();

        File dir = Files.createTempDirectory("v10file").toFile();
        long fileId = jdbc.queryForObject("select f_create_seq()", Long.class);
        File physical = new File(dir, String.valueOf(fileId));
        assertThat(physical.createNewFile()).isTrue();
        jdbc.update("insert into sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_reg_date, sys10_server_path) values (?, ?, 'v10.txt', now(), ?)", fileId, id, dir.getAbsolutePath());

        AprApprWriteRes res = write.delete(user(29035L), id);
        assertThat(res.ok()).isTrue();
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, id)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from sys10_file where sys10_parent_id = ?", Integer.class, id)).isZero();
        assertThat(physical).doesNotExist();
        dir.delete();
    }
}
