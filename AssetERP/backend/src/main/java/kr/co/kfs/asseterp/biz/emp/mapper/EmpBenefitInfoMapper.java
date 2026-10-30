package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp55_benefit_info.xml + UpdateDataModel(emp55_benefit_info) — 복리후생비 고객사별 설정 */
@Mapper
public interface EmpBenefitInfoMapper {
    /** AS-IS selectBySearchText */
    List<BenefitInfoRes> selectBySearchText(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS selectByCompanyId (U05 계정코드 창 — 복리후생비 코드순) */
    List<BenefitInfoRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS selectByBenefitCode (U05 — 신청구분의 문서분류 연결코드·계정과목) */
    List<BenefitInfoRes> selectByBenefitCode(@Param("companyId") Long companyId, @Param("benefitCode") String benefitCode);

    /** AS-IS selectById */
    BenefitInfoRes selectById(@Param("benefitInfoId") Long benefitInfoId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("benefitInfoId") Long benefitInfoId, @Param("companyId") Long companyId, @Param("req") BenefitInfoSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") BenefitInfoSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS insertInitData: 고른 설정 한 건을 companyId로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("benefitInfoId") Long benefitInfoId);
}
