package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRecordReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRecordSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffResultReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRecordRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckManlService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckInsuffService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** N24 미흡내역 조치(Tdm54_Tab_CheckInsuff)의 조치 저장·조치완료·완료취소·조치기록 저장을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmChckInsuffService.class, TdmCheckManlService.class})
class TdmChckInsuffDbTest {

    @Autowired TdmChckInsuffService service;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean SysFileService fileService;

    /** kfstest — 상태 10(발생), 조치기록·승인 없음 */
    private static final long COMPANY = 28000L;
    private static final long INSUFF = 202601279442412L;
    /** 상태 19(조치완료), 승인 0건 / 상태 21(승인중), 승인 3건 */
    private static final long DONE = 202512029201903L;
    private static final long APPROVING = 202512129207017L;
    private static final UserPrincipal USER = UserPrincipal.builder().userId(29037L).companyId(COMPANY).name("N24시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    private long count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Long.class, args);
    }

    @Test
    void 저장은_조치결과만_바꾸고_상태는_그대로다() {
        ChckInsuffListRes before = service.search(USER, "2025-01-01", "2026-10-25", false, null, null, "%").stream()
                .filter(r -> r.chckInsuffId() == INSUFF).findFirst().orElseThrow();
        long recordsBefore = count("SELECT COUNT(*) FROM tdm55_chck_record WHERE tdm55_relate_table_id = ?", INSUFF);
        ChckInsuffListRes saved = service.updateResult(USER, INSUFF, new ChckInsuffResultReq("U", "2026-12-31", "2026-02-01", 29037L, "조치했음"));
        assertThat(saved.statusCode()).isEqualTo(before.statusCode()).isEqualTo("10");
        assertThat(saved.dueDate()).isEqualTo("2026-12-31");
        assertThat(saved.actionDate()).isEqualTo("2026-02-01");
        assertThat(saved.actionEmpId()).isEqualTo(29037L);
        assertThat(saved.actionCmnt()).isEqualTo("조치했음");
        assertThat(saved.actionEmpName()).isNotBlank();
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record WHERE tdm55_relate_table_id = ?", INSUFF)).isEqualTo(recordsBefore);   // 저장은 이력을 만들지 않는다
        assertThatThrownBy(() -> service.updateResult(OTHER, INSUFF, new ChckInsuffResultReq("U", null, null, null, null)))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateResult(USER, INSUFF, new ChckInsuffResultReq("X", null, null, null, null)))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 조치완료는_이력을_남기고_완료취소는_되돌린다() {
        // 2026-01-11 설정은 증빙 필수가 아니다
        ChckInsuffListRes done = service.updateResult(USER, INSUFF, new ChckInsuffResultReq("P", "2026-12-31", "2026-02-01", 29037L, "조치했음"));
        assertThat(done.statusCode()).isEqualTo("19");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? AND tdm55_proc_type = '조치완료'", INSUFF)).isEqualTo(1);

        ChckInsuffListRes back = service.updateResult(USER, INSUFF, new ChckInsuffResultReq("C", "2026-12-31", "2026-02-01", 29037L, "조치했음"));
        assertThat(back.statusCode()).isEqualTo("11");
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record WHERE tdm55_relate_table_id = ? AND tdm55_proc_type = '조치완료취소'", INSUFF)).isEqualTo(1);
    }

    @Test
    void 조치완료는_증빙_필수_기간이면_증빙자료가_있어야_한다() {
        // 2025-01-01 설정은 증빙 필수 — 조치기록이 없으니 증빙도 없다
        assertThatThrownBy(() -> service.updateResult(USER, INSUFF, new ChckInsuffResultReq("P", "2025-12-31", "2025-06-01", 29037L, "조치했음")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("증빙자료가 존재하지 않습니다");
        assertThat(count("SELECT COUNT(*) FROM tdm54_chck_insuff WHERE tdm54_chck_insuff_id = ? AND tdm54_status_cd = '10'", INSUFF)).isEqualTo(1);
    }

    @Test
    void 조치완료는_글자수_제한을_검사한다() {
        jdbc.update("UPDATE tdm91_company_setup SET tdm91_cmnt_min_limit = 10 WHERE tdm91_company_id = ? AND tdm91_start_date = DATE '2026-01-11'", COMPANY);
        assertThatThrownBy(() -> service.updateResult(USER, INSUFF, new ChckInsuffResultReq("P", "2026-12-31", "2026-02-01", 29037L, "짧음")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("10자 이상");
    }

    @Test
    void 승인내역이_있으면_완료취소를_할_수_없다() {
        assertThatThrownBy(() -> service.updateResult(USER, APPROVING, new ChckInsuffResultReq("C", null, null, null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("승인진행(또는 완료) 내역입니다");
        ChckInsuffListRes back = service.updateResult(USER, DONE, new ChckInsuffResultReq("C", "2026-12-31", "2025-06-01", 29037L, "조치했음"));
        assertThat(back.statusCode()).isEqualTo("11");
    }

    @Test
    void 조치기록은_삭제_추가_수정을_저장하고_다시_읽는다() {
        List<CheckApprInsuffRecordRes> saved = service.saveRecords(USER, INSUFF, new ChckInsuffRecordSaveReq(List.of(), List.of(
                new ChckInsuffRecordReq(-1L, "2026-02-01", "첫째", "비고1"), new ChckInsuffRecordReq(-2L, "2026-02-02", "둘째", null))));
        assertThat(saved).extracting(CheckApprInsuffRecordRes::content).containsExactly("첫째", "둘째");
        assertThat(saved.get(0).regEmpName()).isNotBlank();
        assertThat(saved.get(0).fileCountStr()).isEqualTo("0건");

        Long first = saved.get(0).chckInsuffRecordId();
        Long second = saved.get(1).chckInsuffRecordId();
        List<CheckApprInsuffRecordRes> next = service.saveRecords(USER, INSUFF, new ChckInsuffRecordSaveReq(List.of(second), List.of(
                new ChckInsuffRecordReq(first, "2026-02-03", "고침", "비고2"))));
        assertThat(next).hasSize(1);
        assertThat(next.get(0).content()).isEqualTo("고침");
        assertThat(next.get(0).regDate()).isEqualTo("2026-02-03");

        assertThatThrownBy(() -> service.saveRecords(USER, INSUFF, new ChckInsuffRecordSaveReq(List.of(), List.of(new ChckInsuffRecordReq(-1L, null, "x", null)))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("등록일을 입력하세요");
        assertThatThrownBy(() -> service.saveRecords(USER, INSUFF, new ChckInsuffRecordSaveReq(List.of(), List.of(new ChckInsuffRecordReq(-1L, "2026-02-01", null, null)))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("조치내용을 입력하세요");
        // 다른 미흡내역의 기록은 건드릴 수 없다
        assertThatThrownBy(() -> service.saveRecords(USER, DONE, new ChckInsuffRecordSaveReq(List.of(first), List.of())))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.saveRecords(OTHER, INSUFF, new ChckInsuffRecordSaveReq(List.of(), List.of())))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 책무_대상_부서를_읽는다() {
        // 29049 = 책무 대상 부서(202205090122582)의 사원, 29037은 책무 대상이 아닌 부서라 null
        UserPrincipal tdmUser = UserPrincipal.builder().userId(29049L).companyId(COMPANY).name("N24시험").build();
        assertThat(service.getTdmOrgId(tdmUser)).isEqualTo(202205090122582L);
        assertThat(service.getTdmOrgId(USER)).isNull();
        assertThat(service.getTdmOrgId(OTHER)).isNull();
    }
}
