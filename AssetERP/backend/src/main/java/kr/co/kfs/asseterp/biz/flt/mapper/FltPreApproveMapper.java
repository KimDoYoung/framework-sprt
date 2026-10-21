package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.PreApproveRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt10_tr.xml, flt01_company_std.xml — J02 사전승인(준감인) */
@Mapper
public interface FltPreApproveMapper {

    /** AS-IS flt10_tr.selectByCompanyId — personIdStr·apprYn은 `%`가 전체, searchText는 `%검색어%` */
    List<PreApproveRes> selectPreApproves(@Param("companyId") Long companyId, @Param("personIdStr") String personIdStr,
                                          @Param("apprYn") String apprYn, @Param("trType") String trType,
                                          @Param("startDate") String startDate, @Param("closeDate") String closeDate,
                                          @Param("searchText") String searchText, @Param("noLimitYn") boolean noLimitYn);

    /** AS-IS flt01_company_std.getExpectTrDate2 */
    String selectExpectTrDate2(@Param("companyId") Long companyId, @Param("stdDate") String stdDate);

    /** AS-IS flt10_tr.updateStatusCode */
    int updateStatusCode(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("trId") Long trId,
                         @Param("statusCode") String statusCode, @Param("rejectReason") String rejectReason,
                         @Param("expectTrDate") String expectTrDate);

    /** AS-IS flt10_tr.updateAddConfirmer */
    int updateAddConfirmer(@Param("companyId") Long companyId, @Param("trId") Long trId, @Param("addConfirmerId") Long addConfirmerId);

    /** UpdateDataModel(flt10_tr) — 사유만 */
    int updateRejectReason(@Param("companyId") Long companyId, @Param("trId") Long trId, @Param("rejectReason") String rejectReason);

    /** AS-IS flt10_tr.getSendMessageList 행 수 */
    int selectSendMessageCount(@Param("companyId") Long companyId);

    Boolean selectInvestLimitUnvisibleYn(@Param("companyId") Long companyId, @Param("toDay") String toDay);

    Boolean selectAddConfirmYn(@Param("companyId") Long companyId);
}
