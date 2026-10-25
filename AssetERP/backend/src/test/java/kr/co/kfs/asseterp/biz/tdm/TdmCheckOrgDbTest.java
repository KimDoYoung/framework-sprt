package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRow;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCheckerReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckManlService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckOrgService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckApprStepService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** N21 업무점검자 지정 및 승인요청(Tdm51_Tab_CheckOrg)의 확정·승인요청·점검자 지정·승인선 저장을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmCheckOrgService.class, TdmCheckManlService.class, TdmChckApprStepService.class})
class TdmCheckOrgDbTest {

    @Autowired TdmCheckOrgService orgService;
    @Autowired TdmCheckManlService manlService;
    @Autowired TdmChckApprStepService stepService;
    @Autowired JdbcTemplate jdbc;
    /** TdmCheckManlService가 점검시작취소의 증빙 파일을 지울 때 쓴다 — 이 시험은 파일을 다루지 않는다 */
    @MockitoBean SysFileService fileService;

    /** kfstest (2026.11 부서 점검현황 — 점검자 지정·승인선이 끝났고 확정 전인 부서) */
    private static final long COMPANY = 28000L;
    private static final long ORG_READY = 202608069820268L;
    /** 점검자가 지정되지 않은 점검항목이 있는 부서 */
    private static final long ORG_NO_CHECKER = 202608069820188L;
    private static final UserPrincipal USER = UserPrincipal.builder().userId(29037L).companyId(COMPANY).name("N21시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    private long count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Long.class, args);
    }

    private long appr60(long orgId) {
        return count("SELECT COUNT(*) FROM tdm60_chck_manl_appr WHERE tdm60_chck_manl_id IN (SELECT tdm52_chck_manl_id FROM tdm52_chck_manl WHERE tdm52_chck_org_id = ?)", orgId);
    }

    private List<String> statuses(long orgId) {
        return jdbc.queryForList("SELECT DISTINCT COALESCE(tdm52_check_status_cd,'-') FROM tdm52_chck_manl WHERE tdm52_chck_org_id = ?", String.class, orgId);
    }

    @Test
    void 확정은_검사를_통과해야_하고_확정취소는_되돌린다() {
        assertThatThrownBy(() -> orgService.updateFix(USER, ORG_NO_CHECKER, "P"))
                .isInstanceOf(BusinessException.class).hasMessageContaining("점검자가 지정되지 않은 점검항목이 존재합니다");
        assertThatThrownBy(() -> orgService.updateFix(USER, ORG_READY, "X"))
                .isInstanceOf(BusinessException.class).hasMessageContaining("정의되지 않은 처리구분자");
        assertThatThrownBy(() -> orgService.updateFix(OTHER, ORG_READY, "P")).isInstanceOf(BusinessException.class);

        assertThat(appr60(ORG_READY)).isZero();
        long cmntBefore = count("SELECT COUNT(*) FROM tdm59_chck_appr_cmnt");

        orgService.updateFix(USER, ORG_READY, "P");
        assertThat(appr60(ORG_READY)).isPositive();
        assertThat(statuses(ORG_READY)).containsExactly("10");
        assertThat(count("SELECT COUNT(*) FROM tdm59_chck_appr_cmnt")).isGreaterThan(cmntBefore);
        assertThat(orgService.search(USER, "2026.11", 202511249196638L, null)).anyMatch(r -> r.chckOrgId() == ORG_READY && r.fixYn() && r.checkStatusAll10Yn());

        orgService.updateFix(USER, ORG_READY, "C");
        assertThat(appr60(ORG_READY)).isZero();
        assertThat(statuses(ORG_READY)).containsExactly("-");
        assertThat(count("SELECT COUNT(*) FROM tdm59_chck_appr_cmnt")).isEqualTo(cmntBefore);
    }

    @Test
    void 승인요청은_점검완료_항목을_승인요청으로_바꾸고_이력을_남기며_취소하면_되돌린다() {
        orgService.updateFix(USER, ORG_READY, "P");
        // 점검이 끝난 것으로 만든다(점검완료 19)
        jdbc.update("UPDATE tdm52_chck_manl SET tdm52_check_status_cd = '19' WHERE tdm52_chck_org_id = ?", ORG_READY);
        long recordBefore = count("SELECT COUNT(*) FROM tdm55_chck_record");

        orgService.updateApprStatus(USER, ORG_READY, "P");
        assertThat(statuses(ORG_READY)).containsExactly("20");
        assertThat(count("SELECT COUNT(*) FROM tdm60_chck_manl_appr WHERE tdm60_appr_status_cd = '10' AND tdm60_chck_manl_id IN (SELECT tdm52_chck_manl_id FROM tdm52_chck_manl WHERE tdm52_chck_org_id = ?)", ORG_READY)).isPositive();
        // 점검항목마다 1건 + 직책별 승인의견 1건
        long manls = count("SELECT COUNT(*) FROM tdm52_chck_manl WHERE tdm52_chck_org_id = ?", ORG_READY);
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + manls + 1);
        assertThat(jdbc.queryForList("SELECT DISTINCT tdm55_proc_type FROM tdm55_chck_record ORDER BY 1 DESC LIMIT 1", String.class)).isNotEmpty();
        assertThat(orgService.search(USER, "2026.11", 202511249196638L, null)).anyMatch(r -> r.chckOrgId() == ORG_READY && "20".equals(r.orgStatusCode()));

        orgService.updateApprStatus(USER, ORG_READY, "C");
        assertThat(statuses(ORG_READY)).containsExactly("19");
        assertThat(count("SELECT COUNT(*) FROM tdm60_chck_manl_appr WHERE tdm60_appr_status_cd IS NOT NULL AND tdm60_chck_manl_id IN (SELECT tdm52_chck_manl_id FROM tdm52_chck_manl WHERE tdm52_chck_org_id = ?)", ORG_READY)).isZero();
        assertThat(count("SELECT COUNT(*) FROM tdm55_chck_record")).isEqualTo(recordBefore + 2 * manls + 2);
    }

    @Test
    void 점검자를_지정하고_목록은_점검자_미지정만_거를_수_있다() {
        List<CheckManlRes> all = manlService.search(USER, ORG_NO_CHECKER, false, "");
        assertThat(all).isNotEmpty();
        List<CheckManlRes> unspec = manlService.search(USER, ORG_NO_CHECKER, true, "");
        assertThat(unspec).isNotEmpty().allMatch(r -> r.checkerId() == null);
        assertThat(manlService.search(USER, ORG_NO_CHECKER, false, "존재하지않는글자zzzz")).isEmpty();

        manlService.updateChecker(USER, new CheckCheckerReq(List.of(unspec.get(0).chckManlId()), 29037L));
        assertThat(manlService.search(USER, ORG_NO_CHECKER, true, "")).hasSize(unspec.size() - 1);
        assertThatThrownBy(() -> manlService.updateChecker(OTHER, new CheckCheckerReq(List.of(unspec.get(0).chckManlId()), 29037L)))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> manlService.search(OTHER, ORG_NO_CHECKER, false, "")).isInstanceOf(BusinessException.class);
    }

    @Test
    void 승인선은_행을_더하고_순서를_바꿔_저장하고_지운다() {
        List<CheckApprStepRes> before = stepService.search(USER, ORG_READY);
        assertThat(before).hasSize(2);

        // 새 행(음수 ID) 추가 + 기존 행 순서 바꿈
        stepService.save(USER, List.of(
                new CheckApprStepRow(before.get(1).chckApprStepId(), ORG_READY, "01", before.get(1).apprEmpId()),
                new CheckApprStepRow(before.get(0).chckApprStepId(), ORG_READY, "02", before.get(0).apprEmpId()),
                new CheckApprStepRow(-1L, ORG_READY, "03", 29037L)));
        List<CheckApprStepRes> after = stepService.search(USER, ORG_READY);
        assertThat(after).hasSize(3);
        assertThat(after).extracting(CheckApprStepRes::apprSeq).containsExactlyInAnyOrder("01", "02", "03");

        long newId = after.stream().filter(r -> r.apprEmpId() == 29037L).findFirst().orElseThrow().chckApprStepId();
        assertThat(stepService.delete(USER, List.of(newId))).isEqualTo(1);
        assertThat(stepService.search(USER, ORG_READY)).hasSize(2);
        assertThatThrownBy(() -> stepService.delete(OTHER, List.of(before.get(0).chckApprStepId()))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> stepService.search(OTHER, ORG_READY)).isInstanceOf(BusinessException.class);
    }
}
