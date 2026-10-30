package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprStatusRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp51_relate_appr.xml(selectByCompanyId·updateCloseYn) + emp52_relate_appr.xml(selectByCompanyId·insert·deleteByApprId·updateApprId) — 여비교통비 관리 (U06) */
@Mapper
public interface EmpRelateApprMapper {
    /** AS-IS emp51_relate_appr.selectByCompanyId */
    List<RelateApprRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm);

    /** AS-IS emp51_relate_appr.updateCloseYn */
    int updateCloseYn(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("closeYn") String closeYn);

    /** AS-IS emp52_relate_appr.selectByCompanyId */
    List<RelateApprStatusRes> selectStatusByCompanyId(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS emp52_relate_appr.insert (결재 문서 ID는 상신 뒤 updateApprId로) */
    int insertStatus(@Param("relateApprId") Long relateApprId, @Param("companyId") Long companyId, @Param("yyyymm") String yyyymm);

    /** AS-IS emp52_relate_appr.deleteByApprId (이름과 달리 relateApprId로 지운다) */
    int deleteStatus(@Param("relateApprId") Long relateApprId);

    /** AS-IS emp52_relate_appr.updateApprId */
    int updateApprId(@Param("companyId") Long companyId, @Param("relateApprId") Long relateApprId, @Param("apprId") Long apprId);
}
