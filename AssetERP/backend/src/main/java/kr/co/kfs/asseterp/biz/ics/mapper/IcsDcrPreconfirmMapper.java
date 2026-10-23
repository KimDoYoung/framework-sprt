package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeOption;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** ics40_dcr_preconfirm(준감인 사전확인대장) + ics41_dcr_type(대장분류) — M05·M06 */
@Mapper
public interface IcsDcrPreconfirmMapper {

    /** AS-IS ics40_dcr_preconfirm.selectByConfirm */
    List<IcsDcrPreconfirmRes> selectByConfirm(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                              @Param("closeDate") LocalDate closeDate, @Param("dcrTypeCode") String dcrTypeCode,
                                              @Param("searchText") String searchText);

    /** AS-IS ics40_dcr_preconfirm.selectByReviewConfirm (살아 있는 SQL은 selectByConfirm과 같다 — 나머지는 원본도 주석) */
    List<IcsDcrPreconfirmRes> selectByReviewConfirm(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                                    @Param("closeDate") LocalDate closeDate, @Param("dcrTypeCode") String dcrTypeCode,
                                                    @Param("searchText") String searchText);

    /** AS-IS ics40_dcr_preconfirm.selectByCompanyId — 회사의 사전확인대장 전체 */
    List<IcsDcrPreconfirmRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS ics40_dcr_preconfirm.countByApprNo — 과거 심사필번호로 쓰인 횟수 */
    int countByApprNo(@Param("companyId") Long companyId, @Param("apprNo") String apprNo);

    /** AS-IS ics40_dcr_preconfirm.updateByStatus01 — 승인: 심사필번호 부여 */
    int updateByStatus01(@Param("companyId") Long companyId, @Param("dcrPreconfirmId") Long dcrPreconfirmId,
                         @Param("dcrTypeCode") String dcrTypeCode, @Param("statusCode") String statusCode,
                         @Param("confirmerId") Long confirmerId, @Param("year") String year);

    /** AS-IS ics40_dcr_preconfirm.updateByStatus02 — 취소 */
    int updateByStatus02(@Param("companyId") Long companyId, @Param("dcrPreconfirmId") Long dcrPreconfirmId,
                         @Param("statusCode") String statusCode);

    /** AS-IS Ics40_DcrPreconfirm.modelUpdate → UpdateDataModel(ics40_dcr_preconfirm) UPDATE — 준감인 의견 */
    int updateConfirmMsg(@Param("companyId") Long companyId, @Param("dcrPreconfirmId") Long dcrPreconfirmId,
                         @Param("confirmMsg") String confirmMsg);

    /** AS-IS ics40_dcr_preconfirm.selectById — 저장 결과 한 행 */
    IcsDcrPreconfirmRes selectById(@Param("companyId") Long companyId, @Param("dcrPreconfirmId") Long dcrPreconfirmId);

    /** 회사 설정 sys01_dcr_preconfirm_skip_yn (AS-IS LoginUser.getCompanyModel().getDcrPreconfirmSkipYn()) */
    boolean selectSkipYn(@Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdDcrPreConfirm — selectByConfirm 결과 한 건을 sys99_print에 담는다 */
    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("row") IcsDcrPreconfirmRes row);

    // ── Ics41_Lookup_DcrType ──

    /** AS-IS ics41_dcr_type.selectByText */
    List<IcsDcrTypeRes> selectDcrTypes(@Param("companyId") Long companyId, @Param("searchText") String searchText, @Param("useYn") String useYn);

    /** AS-IS sys09_code.selectIcs41DcrType — 사용 중인 대장분류 콤보 */
    List<IcsDcrTypeOption> selectDcrTypeOptions(@Param("companyId") Long companyId);

    /** AS-IS ics41_dcr_type.adYnCheck */
    List<IcsDcrTypeRes> selectAdYn(@Param("companyId") Long companyId, @Param("dcrTypeCode") String dcrTypeCode);

    /** AS-IS ics41_dcr_type.selectById */
    IcsDcrTypeRes selectDcrTypeById(@Param("dcrTypeId") Long dcrTypeId);

    int insertDcrType(@Param("companyId") Long companyId, @Param("req") IcsDcrTypeSaveReq req);

    int updateDcrType(@Param("companyId") Long companyId, @Param("req") IcsDcrTypeSaveReq req);

    int deleteDcrType(@Param("companyId") Long companyId, @Param("dcrTypeId") Long dcrTypeId);
}
