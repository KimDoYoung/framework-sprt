package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyOptionRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyOrgParam;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRow;
import kr.co.kfs.asseterp.biz.sys.dto.CompanySearchParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys01_company.xml + UpdateDataModel(sys01_company)의 INSERT와 회사 추가 후 초기화 */
@Mapper
public interface SysCompanyMapper {
    /** AS-IS selectByName */
    List<CompanyRes> searchCompanies(CompanySearchParam param);

    /** AS-IS selectById */
    CompanyRes selectCompany(Long companyId);

    /** 관리정보 탭 (AS-IS selectById 중 Info01 컬럼) */
    CompanyManageRes selectCompanyManage(Long companyId);

    /** AS-IS selectById 중 문서번호 채번방식 (null → '1') */
    String selectDcrNumberingCode(Long companyId);

    /** AS-IS Sys01_Company.selectById L20-29: main_image_id가 비었으면 채번해 넣는다 */
    Long selectMainImageId(Long companyId);

    /** AS-IS updateMainImageId */
    int updateMainImageId(@Param("companyId") Long companyId, @Param("mainImageId") Long mainImageId);

    /** 관리정보 탭 저장 — UpdateDataModel 동적 UPDATE 중 그리드에서 바뀌는 컬럼만 */
    int updateCompanyManage(CompanyManageReq req);

    /** AS-IS updateNote */
    int updateNote(@Param("companyId") Long companyId, @Param("note") String note);

    /** 다른 회사가 같은 서브도메인을 쓰는지 */
    int countByLocNmExcept(@Param("locNm") String locNm, @Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    /** 같은 서브도메인(sys01_loc_nm) 수 — 테넌트 판정이 서브도메인으로 하므로 중복을 막는다 */
    int countByLocNm(String locNm);

    /** 같은 사업자등록번호 수 (sys01_biz_no unique) */
    int countByBizNo(String bizNo);

    int insertCompany(CompanyRow row);

    /** AS-IS Sys01_Company.delete → UpdateDataModel.deleteModel: sys01_company 행만 지운다(초기화로 만든 데이터는 남는다) */
    int deleteCompanies(List<Long> companyIds);

    /** AS-IS sys00_common.selectCompanyInfo (회사 콤보: 회사 ID / 서브도메인) */
    List<CompanyOptionRes> selectCompanyOptions();

    // ── 회사 추가 후 초기화 (AS-IS UpdateDataModel L90-224, 순서 그대로) ──

    /** 1. org01_code.insertOrg01Code */
    int insertOrgCode(CompanyOrgParam param);

    /** 1. org02_info.insertOrg02Info */
    int insertOrgInfo(CompanyOrgParam param);

    /** 2. sys09_code.insertFromSys09 */
    int insertCodesFromAdmin(Long companyId);

    /** 4. call dcr01_import_from_admin */
    void importDcrFromAdmin(Long companyId);

    /** 5. ast02_detail.insertFromAst02 */
    int insertAstDetailFromAdmin(Long companyId);

    /** 6. sys30_leave_year.insertFromSys30 */
    int insertLeaveYearFromAdmin(Long companyId);

    /** 7. pay04_formula.insertFromAdmin (itemTypeCodeName = PayFormulaCode) */
    int insertPayFormulaFromAdmin(Long companyId);

    /** 8. ics02_manager.insertFromIcs02 */
    int insertIcsManager(Long companyId);

    /** 9. act01_account_code.insertFromAct01 */
    int insertAccountCodesFromAdmin(Long companyId);

    /** 11. ics30_compliance.insertFormIcs30 */
    int insertCompliancesFromAdmin(Long companyId);

    /** 12. ics33_compliance_answer.insertFormIcs30 */
    int insertComplianceAnswersFromAdmin(Long companyId);

    /** 13. bbs12_application_form.insertFormBbs12 */
    int insertApplicationFormsFromAdmin(Long companyId);

    /** 14. pay51_expense_form.insertFormPay51 */
    int insertExpenseFormsFromAdmin(Long companyId);

    /** 15. com11_form_mapping_multi.insertFormCom11 */
    int insertFormMappingsFromAdmin(Long companyId);
}
