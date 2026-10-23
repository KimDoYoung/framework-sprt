package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivityRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivitySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsExtrActivityMapper {

    /** AS-IS ics35_extr_activity.selectByPersonId — 로그인 사원 본인의 신청 */
    List<IcsExtrActivityRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS ics35_extr_activity.selectByCompanyId — unknown이면 기간 없이 결과보고 누락건(결과보고 상신이 없거나 반려)만 */
    List<IcsExtrActivityRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                               @Param("closeDate") LocalDate closeDate, @Param("unknown") boolean unknown);

    /** AS-IS ics35_extr_activity.selectById — 저장 결과 한 행 */
    IcsExtrActivityRes selectById(@Param("extrActivityId") Long extrActivityId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Ics35_ExtrActivity.modelUpdate → UpdateDataModel(ics35_extr_activity) INSERT */
    int insertExtrActivity(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") IcsExtrActivitySaveReq req);

    /** AS-IS Ics35_ExtrActivity.modelUpdate → UpdateDataModel(ics35_extr_activity) UPDATE — 로그인 회사 행만 */
    int updateExtrActivity(@Param("companyId") Long companyId, @Param("req") IcsExtrActivitySaveReq req);

    /** AS-IS Ics35_ExtrActivity.delete(UpdateDataModel.deleteModel) — 로그인 회사 행만 */
    int deleteExtrActivity(@Param("extrActivityId") Long extrActivityId, @Param("companyId") Long companyId);
}
