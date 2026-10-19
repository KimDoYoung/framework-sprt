package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeAdminRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodePrintSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeTreeRes;
import kr.co.kfs.asseterp.biz.act.dto.ActCompanyRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act01_account_code.xml — 계정코드 */
@Mapper
public interface ActAccountCodeMapper {
    /** AS-IS selectBySlipYn: 사용·전표생성 계정만 */
    List<AccountCodeRes> selectBySlipYn(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                        @Param("attributeCode") String attributeCode);

    /** AS-IS selectByCompanyId (E27) */
    List<AccountCodeAdminRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                                @Param("useYn") String useYn, @Param("attributeCode") String attributeCode);

    /** AS-IS selectById (E27) */
    AccountCodeAdminRes selectById(@Param("accountCodeId") Long accountCodeId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT (E27 편집창) */
    int insert(@Param("accountCodeId") Long accountCodeId, @Param("companyId") Long companyId, @Param("req") AccountCodeSaveReq req);

    /** UpdateDataModel UPDATE (E27 편집창) — 회사 조건을 더했다 */
    int update(@Param("companyId") Long companyId, @Param("req") AccountCodeSaveReq req);

    /** UpdateDataModel UPDATE (E27 출력정보 및 사용여부 설정) — 바뀌는 세 열만 */
    int updatePrint(@Param("companyId") Long companyId, @Param("req") AccountCodePrintSaveReq req);

    /** UpdateDataModel.deleteModel — 회사 조건을 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS selectTreeByCompanyId (E27 계정과목복사 창) */
    List<AccountCodeTreeRes> selectTreeByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS selectTreeByAccountCode: 계정 하나와 그 상위 계정들(아래 단계 → 위 단계 순서가 아니라 level DESC = 최상위부터) */
    List<AccountCodeAdminRes> selectTreeByAccountCode(@Param("companyId") Long companyId, @Param("accountCode") String accountCode);

    /** AS-IS selectByAccountCode: 회사에 그 계정이 있는지 */
    List<AccountCodeAdminRes> selectByAccountCode(@Param("companyId") Long companyId, @Param("accountCode") String accountCode);

    /** AS-IS insertAdminAccountCode */
    int insertAdminAccountCode(@Param("stdCompanyId") Long stdCompanyId, @Param("companyId") Long companyId, @Param("accountCode") String accountCode);

    /** AS-IS updateAdminAccountCode (정렬코드는 원본이 값을 안 넘겨 NULL로 덮는다) */
    int updateAdminAccountCode(@Param("companyId") Long companyId, @Param("std") AccountCodeAdminRes std);

    /** AS-IS sys01_company.selectByUseYn (E27 계정과목복사 창) */
    List<ActCompanyRes> selectUseCompanies();
}
