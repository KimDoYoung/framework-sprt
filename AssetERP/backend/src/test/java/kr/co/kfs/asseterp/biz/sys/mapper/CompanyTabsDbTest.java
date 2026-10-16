package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyAccountReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyAccountRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyApprovalReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyApprovalRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyBasicReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyBasicRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeService;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.ibatis.session.SqlSession;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** A15-3 기본정보·전자결재/내부통제·경영/회계 탭 저장을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCompanyService.class, SysCodeService.class})
class CompanyTabsDbTest {

    @Autowired SysCompanyService companyService;
    @Autowired SysCodeService codeService;
    @Autowired JdbcTemplate jdbc;
    @Autowired SqlSession sqlSession; // JdbcTemplate로 직접 바꾼 뒤 MyBatis 1차 캐시를 비우기 위해

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private static final long KFS = 28000L;

    private static CompanyBasicReq basicOf(CompanyBasicRes r, String bizNo, String decCorpRegNo) {
        return new CompanyBasicReq(r.companyId(), r.startDate(), bizNo, decCorpRegNo, r.empInfo(), r.mobileTelNo(),
                r.officeTelNo(), r.officeFaxNo(), r.emailAddr(), r.zipCd(), r.zipAddr(), r.zipDetail());
    }

    private static CompanyApprovalReq approvalOf(CompanyApprovalRes r) {
        return new CompanyApprovalReq(r.companyId(), r.apprStepLockYn(), r.companyRepNm(), r.aprManagerInfoYn(), r.dcrNumberingCd(),
                r.dcrDetailUseYn(), r.icsCheckCycleType(), r.icsComplyCycleType(), r.icsNonStayYn(), r.fltOnlyCurrYn(), r.icsGuideYn());
    }

    private static CompanyAccountReq accountOf(CompanyAccountRes r, String leaveMonthCd) {
        return new CompanyAccountReq(r.companyId(), leaveMonthCd, r.leaveYn(), r.leaveCompulsionRt(), r.taxType(), r.cardRealUserYn(),
                r.incomeTaxFilingCd(), r.accountCloseMonth(), r.ownerCapitalApplyCd(), r.astManagerAutoYn(), r.astEvalCycleCd(),
                r.empEvalCycleCd(), r.empEvalMonthCd());
    }

    private String corpRegNo() {
        return jdbc.queryForObject("select sys01_corp_reg_no from sys01_company where sys01_company_id = ?", String.class, KFS);
    }

    @Test
    void 기본정보_같은_값_저장은_그대로이고_법인등록번호는_암호화해_넣는다() {
        CompanyBasicRes before = companyService.getCompanyBasic(sysAdmin, KFS);
        assertThat(companyService.updateCompanyBasic(sysAdmin, basicOf(before, before.bizNo(), before.decCorpRegNo()))).isEqualTo(before);

        CompanyBasicRes changed = companyService.updateCompanyBasic(sysAdmin, basicOf(before, before.bizNo(), "110111-0000000"));
        assertThat(changed.decCorpRegNo()).isEqualTo("110111-0000000");
        assertThat(corpRegNo()).isNotEqualTo("110111-0000000"); // DB에는 암호값

        // 법인등록번호를 비우면(GXT null) getCorpRegNo를 부르지 않으므로 암호값이 그대로 남는다
        String enc = corpRegNo();
        companyService.updateCompanyBasic(sysAdmin, basicOf(before, before.bizNo(), ""));
        assertThat(corpRegNo()).isEqualTo(enc);
    }

    @Test
    void 기본정보_사업자번호는_필수이고_다른_회사_것은_쓸_수_없다() {
        CompanyBasicRes r = companyService.getCompanyBasic(sysAdmin, KFS);
        assertThatThrownBy(() -> companyService.updateCompanyBasic(sysAdmin, basicOf(r, " ", r.decCorpRegNo())))
                .isInstanceOf(BusinessException.class).hasMessage("사업자 등록번호는 필수 입력항목입니다.");
        String other = jdbc.queryForObject("select sys01_biz_no from sys01_company where sys01_company_id = 0", String.class);
        assertThatThrownBy(() -> companyService.updateCompanyBasic(sysAdmin, basicOf(r, other, r.decCorpRegNo())))
                .isInstanceOf(BusinessException.class).hasMessage("이미 등록된 사업자등록번호입니다.");
    }

    @Test
    void 전자결재_null_결재선잠금은_true로_보이고_저장하면_true가_된다() {
        CompanyApprovalRes before = companyService.getCompanyApproval(sysAdmin, KFS);
        assertThat(companyService.updateCompanyApproval(sysAdmin, approvalOf(before))).isEqualTo(before);

        jdbc.update("update sys01_company set sys01_appr_step_lock_yn = null, sys01_dcr_numbering_cd = null where sys01_company_id = ?", KFS);
        sqlSession.clearCache();
        CompanyApprovalRes nulls = companyService.getCompanyApproval(sysAdmin, KFS);
        assertThat(nulls.apprStepLockYn()).isEqualTo("true");
        assertThat(nulls.dcrNumberingCd()).isEqualTo("1");
        companyService.updateCompanyApproval(sysAdmin, approvalOf(nulls));
        assertThat(jdbc.queryForObject("select sys01_appr_step_lock_yn from sys01_company where sys01_company_id = ?", String.class, KFS))
                .isEqualTo("true");
    }

    @Test
    void 경영회계_같은_값_저장은_그대로이고_코드를_바꾸면_이름도_바뀐다() {
        CompanyAccountRes before = companyService.getCompanyAccount(sysAdmin, KFS);
        assertThat(companyService.updateCompanyAccount(sysAdmin, accountOf(before, before.leaveMonthCd()))).isEqualTo(before);

        CompanyAccountRes changed = companyService.updateCompanyAccount(sysAdmin, accountOf(before, "03"));
        assertThat(changed.leaveMonthCd()).isEqualTo("03");
        assertThat(changed.leaveMonthNm()).isNotBlank();
    }

    @Test
    void 고객명이나_접근코드가_없는_회사는_탭을_저장할_수_없다() {
        Long id = jdbc.queryForObject("select min(sys01_company_id) from sys01_company where sys01_company_nm is null or sys01_loc_nm is null", Long.class);
        CompanyAccountRes r = companyService.getCompanyAccount(sysAdmin, id);
        assertThatThrownBy(() -> companyService.updateCompanyAccount(sysAdmin, accountOf(r, r.leaveMonthCd())))
                .isInstanceOf(BusinessException.class).hasMessageEndingWith("필수 입력항목입니다.");
    }

    @Test
    void 인사평가_평가기간_콤보는_코드그룹_CycleCode002() {
        List<CodeRes> codes = codeService.searchCodesByKindGroup(sysAdmin, "CycleCode002");
        assertThat(codes).extracting(CodeRes::code).containsExactly("05", "06");
    }
}
