package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/fnd/mapper/fnd30_opr.xml (수요예측 Q05) + Fnd30_Opr.deleteApprId가 부르는 apr 삭제 SQL */
@Mapper
public interface FndOprMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS selectByDemandDate — searchText는 "%…%" */
    List<OprDemandRes> selectByDemandDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                          @Param("closeDate") LocalDate closeDate, @Param("oprCode") String oprCode,
                                          @Param("searchText") String searchText);

    /** AS-IS selectById — 로그인 회사 행만 */
    OprDemandRes selectById(@Param("oprId") Long oprId, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel 동적 INSERT (oprCode "02", oprDate = 신청일) */
    int insertDemand(@Param("oprId") Long oprId, @Param("companyId") Long companyId, @Param("r") OprDemandSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE — 화면이 바꾸는 열만 */
    int updateDemand(@Param("oprId") Long oprId, @Param("companyId") Long companyId, @Param("r") OprDemandSaveReq req);

    /** AS-IS Fnd30_Opr.delete (UpdateDataModel.deleteModel) */
    int deleteOpr(@Param("oprId") Long oprId, @Param("companyId") Long companyId);

    /** AS-IS Fnd30_Opr.deleteOprFund (fnd31_opr_fund.deleteOprFund) */
    int deleteOprFunds(@Param("oprId") Long oprId);

    /** AS-IS Fnd30_Opr.deleteApprId (1)~(4) */
    int deleteRelateFund(@Param("apprId") Long apprId);

    int deleteFiles(@Param("apprId") Long apprId);

    int deleteApprSteps(@Param("apprId") Long apprId);

    int deleteAppr(@Param("apprId") Long apprId);
}
