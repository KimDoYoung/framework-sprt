package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.service.BizErpContCorpService;
import kr.co.kfs.asseterp.biz.biz.service.BizErpFeeService;
import kr.co.kfs.asseterp.biz.biz.service.BizErpSetupService;

/** EE22 AssetERP 계약사 관리(Biz51_Tab_ErpContCorp)·사용료·기본설정을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({BizErpContCorpService.class, BizErpFeeService.class, BizErpSetupService.class})
class BizErpDbTest {

    @Autowired BizErpContCorpService corpService;
    @Autowired BizErpFeeService feeService;
    @Autowired BizErpSetupService setupService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private static BizErpContCorpSaveReq corpReq(Long id, long corpId, String status, String note) {
        return new BizErpContCorpSaveReq(id, corpId, status, "10", LocalDate.of(2099, 1, 1), LocalDate.of(2099, 1, 2), LocalDate.of(2099, 12, 31),
                LocalDate.of(2099, 2, 1), null, null, "담당", "010", "a@b.c; d@e.f;", "대표", "주소", note);
    }

    @Test
    void 계약사_목록은_계약상태와_검색어로_거른다() {
        int all = corpService.search(null, "").size();
        int contracted = corpService.search("1", "").size();
        assertThat(all).isEqualTo(jdbc.queryForObject("select count(*) from biz51_erp_cont_corp", Integer.class));
        assertThat(contracted).isEqualTo(jdbc.queryForObject("select count(*) from biz51_erp_cont_corp where biz51_cont_status_cd = '1'", Integer.class));
        assertThat(corpService.search(null, "없는계약사zzz")).isEmpty();
    }

    @Test
    void 계약사_등록_수정_삭제는_연결된_사용료와_파일도_지운다() {
        long corpId = jdbc.queryForObject("select biz51_corp_id from biz51_erp_cont_corp limit 1", Long.class);
        BizErpContCorpRes created = corpService.save(corpReq(null, corpId, "1", "시험"));
        assertThat(created.erpContCorpId()).isPositive();
        assertThat(created.contStatusNm()).isNotBlank();
        assertThat(created.fileCountStr()).isEqualTo("0건");

        BizErpContCorpRes again = corpService.save(corpReq(created.erpContCorpId(), corpId, "9", "고침"));
        assertThat(again.note()).isEqualTo("고침");
        assertThat(again.contStatusCd()).isEqualTo("9");

        feeService.save(List.of(new BizErpFeeSaveReq(null, created.erpContCorpId(), LocalDate.of(2020, 1, 1), null, 100L, 200L, "05", "1", "10", "true", "true", "true",
                1L, 2L, 3L, 4L, 5L, 6L, 7L, "1", "1")));
        assertThat(corpService.get(created.erpContCorpId()).erpFeeNm()).isNotNull();

        assertThat(corpService.delete(List.of(created.erpContCorpId()))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from biz52_erp_fee where biz52_erp_cont_corp_id = ?", Integer.class, created.erpContCorpId())).isZero();
    }

    @Test
    void 사용료_저장은_새_행은_번호를_받고_기준일_사용료를_읽는다() {
        long contCorpId = jdbc.queryForObject("select biz51_erp_cont_corp_id from biz51_erp_cont_corp limit 1", Long.class);
        List<BizErpFeeRes> saved = feeService.save(List.of(
                new BizErpFeeSaveReq(-1L, contCorpId, LocalDate.of(2098, 1, 1), LocalDate.of(2098, 12, 31), 100L, 200L, "05", "1", "10", "true", "false", "true",
                        1L, 2L, 3L, 4L, 5L, 6L, 7L, "1", "2")));
        assertThat(saved).hasSize(1);
        BizErpFeeRes r = saved.get(0);
        assertThat(r.erpFeeId()).isPositive();
        assertThat(r.vatNm()).isEqualTo("별도");
        assertThat(r.chargeDayStr()).isEqualTo("5일");
        assertThat(feeService.current(user(), contCorpId, LocalDate.of(2098, 6, 1)).erpFeeId()).isEqualTo(r.erpFeeId());
        assertThat(feeService.search(user(), contCorpId).get(0).erpFeeId()).isEqualTo(r.erpFeeId());   // 적용시작일 내림차순

        BizErpFeeRes upd = feeService.save(List.of(new BizErpFeeSaveReq(r.erpFeeId(), contCorpId, r.startDate(), null, 111L, 222L, "05", "2", "10", "false", "false", "false",
                null, null, null, null, null, null, null, "2", "1"))).get(0);
        assertThat(upd.erpFee()).isEqualTo(111L);
        assertThat(upd.addFeeSmsYn()).isEqualTo("false");
        assertThat(feeService.delete(List.of(r.erpFeeId()))).isEqualTo(1);
    }

    @Test
    void 기본설정은_메모와_메일양식_행을_목록에서_뺀다() {
        List<BizErpSetupRes> list = setupService.search(user());
        assertThat(list).hasSize(jdbc.queryForObject("select count(*) from biz50_erp_setup where biz50_note_yn != 'true'", Integer.class));

        BizErpSetupRes created = setupService.save(List.of(new BizErpSetupSaveReq(-1L, LocalDate.of(2099, 1, 1), 1L, 2L, 3L, 4L, 5L, "05", "1", 6L, 7L, "10"))).get(0);
        assertThat(created.erpSetupId()).isPositive();
        assertThat(created.vatNm()).isEqualTo("별도");
        assertThat(setupService.search(user()).get(0).erpSetupId()).isEqualTo(created.erpSetupId());   // 적용시작일 내림차순
        assertThat(setupService.current(user(), LocalDate.of(2099, 6, 1)).erpSetupId()).isEqualTo(created.erpSetupId());
        assertThat(jdbc.queryForObject("select biz50_note_yn from biz50_erp_setup where biz50_erp_setup_id = ?", String.class, created.erpSetupId())).isEqualTo("false");

        BizErpSetupRes upd = setupService.save(List.of(new BizErpSetupSaveReq(created.erpSetupId(), created.startDate(), 9L, 2L, 3L, 4L, 5L, "05", "2", 6L, 7L, "10"))).get(0);
        assertThat(upd.smsBaseCount()).isEqualTo(9L);
        assertThat(setupService.delete(List.of(created.erpSetupId()))).isEqualTo(1);
    }

    @Test
    void 메모는_있으면_고치고_없으면_만든다() {
        setupService.saveNote("시험 메모");
        assertThat(setupService.note()).isEqualTo("시험 메모");
        // (같은 세션이라 SELECT 가 1차 캐시를 읽으므로, 지운 뒤 상태는 JDBC 로 본다. 요청마다 세션이 새로 열리는 실제 서버에서는 해당 없음)
        jdbc.update("delete from biz50_erp_setup where biz50_note_yn = 'true'");
        assertThat(jdbc.queryForObject("select count(*) from biz50_erp_setup where biz50_note_yn = 'true'", Integer.class)).isZero();
        setupService.saveNote("새 메모");
        assertThat(jdbc.queryForObject("select biz50_note from biz50_erp_setup where biz50_note_yn = 'true'", String.class)).isEqualTo("새 메모");
        assertThat(jdbc.queryForObject("select count(*) from biz50_erp_setup where biz50_note_yn = 'true'", Integer.class)).isEqualTo(1);
        // 메모 행은 목록에 나오지 않는다
        assertThat(setupService.search(user())).extracting(BizErpSetupRes::startDate).doesNotContainNull();
    }

    @Test
    void 메일양식은_행이_없으면_빈_행을_만들고_있으면_고친다() {
        jdbc.update("delete from biz50_erp_setup where biz50_start_date is null and coalesce(biz50_note_yn,'false') = 'false'");
        assertThat(jdbc.queryForObject("select count(*) from biz50_erp_setup where biz50_start_date is null and coalesce(biz50_note_yn,'false') = 'false'", Integer.class)).isZero();
        BizErpMailFormRes created = setupService.saveMailForm(new BizErpMailFormReq(null, null));
        assertThat(created.erpSetupId()).isPositive();
        assertThat(setupService.mailForm().erpSetupId()).isEqualTo(created.erpSetupId());
        setupService.saveMailForm(new BizErpMailFormReq(created.erpSetupId(), "<p>#{계약사명}</p>"));
        assertThat(setupService.mailForm().mailForm()).isEqualTo("<p>#{계약사명}</p>");
        // 목록에는 나오지 않는다(note_yn 이 비어 있어 `!= 'true'` 비교가 null)
        assertThat(setupService.search(user())).extracting(BizErpSetupRes::erpSetupId).doesNotContain(created.erpSetupId());
    }
}
