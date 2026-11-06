package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizContCorpRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContDualFundReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizContDualFundRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContEachAddrRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContEachReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizContEachRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContFeeInfoRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContHoldFeeRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContRelateApprReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizContRelateApprRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizContShareReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizContShareRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizContWithCorpReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizContWithCorpRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/biz/mapper/biz10~biz17 · ast30_book_fund_fee.selectByContCorpId — 계약사 관리 Biz10_Tab_ContCorp (EE20) */
@Mapper
public interface BizContCorpMapper {

    List<BizContCorpRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText, @Param("check") String check,
                                      @Param("stdYear") String stdYear, @Param("statusCode") String statusCode, @Param("statusCheck") String statusCheck,
                                      @Param("endMonth") Long endMonth, @Param("sortType") String sortType);

    BizContCorpRes selectById(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    List<BizContCorpRes> selectHistories(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    List<Long> selectHistoryIds(@Param("contCorpId") Long contCorpId);

    long selectNextId();

    int countCorp(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    int insertCorp(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    int deleteCorp(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    int deleteSharesByCorp(@Param("contCorpId") Long contCorpId);

    int deleteRelateApprsByCorp(@Param("contCorpId") Long contCorpId);

    int deleteWithCorpsByCorp(@Param("contCorpId") Long contCorpId);

    int deleteFeeInfosByCorp(@Param("contCorpId") Long contCorpId);

    int deleteHistoriesByCorp(@Param("contCorpId") Long contCorpId);

    int deleteHistories(@Param("contHistoryIds") List<Long> contHistoryIds, @Param("companyId") Long companyId);

    int copyShareFromLatest(@Param("contCorpId") Long contCorpId, @Param("contHistoryId") Long contHistoryId);

    int copyShareFromPrevious(@Param("contCorpId") Long contCorpId, @Param("contHistoryId") Long contHistoryId);

    int updateHistory(@Param("contCorpId") Long contCorpId, @Param("h") BizContSaveReq.History h);

    int insertHistory(@Param("contCorpId") Long contCorpId, @Param("h") BizContSaveReq.History h);

    int updateFeeInfo(@Param("contHistoryId") Long contHistoryId, @Param("f") BizContSaveReq.Fee f);

    int insertFeeInfo(@Param("contHistoryId") Long contHistoryId, @Param("f") BizContSaveReq.Fee f);

    BizContFeeInfoRes selectFeeInfoById(@Param("feeInfoId") Long feeInfoId, @Param("companyId") Long companyId);

    List<BizContShareRes> selectShares(@Param("contHistoryId") Long contHistoryId, @Param("companyId") Long companyId);

    int insertShare(@Param("shareId") Long shareId, @Param("r") BizContShareReq r, @Param("companyId") Long companyId);

    int deleteShares(@Param("shareIds") List<Long> shareIds, @Param("companyId") Long companyId);

    List<BizContWithCorpRes> selectWithCorps(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    int updateWithCorp(@Param("r") BizContWithCorpReq r, @Param("companyId") Long companyId);

    int insertWithCorp(@Param("withCorpId") Long withCorpId, @Param("r") BizContWithCorpReq r, @Param("companyId") Long companyId);

    int deleteWithCorps(@Param("withCorpIds") List<Long> withCorpIds, @Param("companyId") Long companyId);

    List<BizContRelateApprRes> selectRelateApprs(@Param("contHistoryId") Long contHistoryId, @Param("companyId") Long companyId);

    int insertRelateAppr(@Param("relateApprId") Long relateApprId, @Param("r") BizContRelateApprReq r);

    int deleteRelateApprs(@Param("relateApprIds") List<Long> relateApprIds);

    List<BizContEachRes> selectEachConts(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    List<BizContEachAddrRes> selectEachContAddr(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    int updateEachCont(@Param("r") BizContEachReq r, @Param("companyId") Long companyId);

    int insertEachCont(@Param("contractId") Long contractId, @Param("r") BizContEachReq r, @Param("companyId") Long companyId);

    int deleteEachConts(@Param("contractIds") List<Long> contractIds, @Param("companyId") Long companyId);

    int updateEachContApprId(@Param("contractId") Long contractId, @Param("apprId") Long apprId, @Param("companyId") Long companyId);

    List<BizContDualFundRes> selectDualFunds(@Param("contCorpId") Long contCorpId, @Param("companyId") Long companyId);

    int updateDualFund(@Param("r") BizContDualFundReq r, @Param("companyId") Long companyId);

    int insertDualFund(@Param("dualFundId") Long dualFundId, @Param("r") BizContDualFundReq r, @Param("companyId") Long companyId);

    int deleteDualFunds(@Param("dualFundIds") List<Long> dualFundIds, @Param("companyId") Long companyId);

    List<BizContHoldFeeRes> selectHoldFees(@Param("companyId") Long companyId, @Param("holdDate") String holdDate,
                                           @Param("contCorpId") Long contCorpId, @Param("searchText") String searchText);

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("r") BizContCorpRes r);
}
