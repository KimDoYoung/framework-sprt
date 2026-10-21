package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferRes;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.EmpLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.InvestLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeCodeRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.ReportEmpRes;
import kr.co.kfs.asseterp.biz.flt.dto.RightsExerciseRes;
import kr.co.kfs.asseterp.biz.flt.dto.RightsExerciseSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrListRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt10_tr.xml, flt01_company_std.xml, flt02_emp.xml, flt03_account.xml, flt08_buy_lockup.xml + UpdateDataModel(flt10_tr) */
@Mapper
public interface FltTrMapper {

    // flt10_tr
    /** AS-IS flt10_tr.selectByTrList (I08 매매내역조회) — ioType·trType은 `%`가 전체 */
    List<TrListRes> selectTrList(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                 @Param("startDate") String startDate, @Param("closeDate") String closeDate,
                                 @Param("preTrYn") String preTrYn, @Param("trType") String trType,
                                 @Param("ioType") String ioType, @Param("searchText") String searchText);

    List<TrRes> selectTrs(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("trType") String trType,
                          @Param("accountId") Long accountId, @Param("regDate") String regDate,
                          @Param("startDate") String startDate, @Param("closeDate") String closeDate,
                          @Param("searchText") String searchText);

    TrRes selectTrById(@Param("trId") Long trId);

    List<InvestLimitRes> selectInvestLimit(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    List<TrItemRes> selectItemNames(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                    @Param("stdDate") String stdDate, @Param("searchText") String searchText);

    Long selectNextId();

    int insertTr(@Param("trId") Long trId, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") TrSaveReq req);

    int updateTr(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") TrSaveReq req);

    int deleteTrs(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("trIds") List<Long> trIds);

    int updateStatusCode(@Param("companyId") Long companyId, @Param("personId") Long personId,
                         @Param("trId") Long trId, @Param("statusCode") String statusCode);

    String selectTrDate(@Param("trId") Long trId);

    int updateUnfillYn(@Param("companyId") Long companyId, @Param("personId") Long personId,
                       @Param("trId") Long trId, @Param("unfillYn") String unfillYn);

    // 안내·기준관리
    TrCheckRes selectEmpByDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    String selectToday();

    Boolean selectFltOnlyCurr(@Param("companyId") Long companyId);

    /** AS-IS flt01_company_std.selectByDate + getExpectTrDate — 기준관리 행이 없으면 null */
    String selectExpectTrDate(@Param("companyId") Long companyId, @Param("stdDate") String stdDate);

    Boolean selectFundHoldStk(@Param("companyId") Long companyId, @Param("stdDate") String stdDate);

    /** AS-IS flt08_buy_lockup.checkLockup — "매수제한·펀드보유·고유자산" 3자리 0/1 */
    String selectBuyLockupCode(@Param("companyId") Long companyId, @Param("itemCode") String itemCode, @Param("stdDate") String stdDate);

    // 계좌·종목유형
    List<TrAccountRes> selectAccountsByDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("setupDate") String setupDate);

    List<ItemTypeCodeRes> selectItemTypeCodes(@Param("companyId") Long companyId, @Param("startDate") String startDate);

    // 정기보고 (I05, Flt10_Tab_RealTransaction)
    List<RealTrRes> selectRealTrs(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountId") Long accountId,
                                  @Param("trType") String trType, @Param("startDate") String startDate, @Param("closeDate") String closeDate,
                                  @Param("searchText") String searchText, @Param("myAccountYn") boolean myAccountYn,
                                  @Param("preTrYn") String preTrYn);

    RealTrRes selectRealTrById(@Param("companyId") Long companyId, @Param("closeDate") String closeDate, @Param("trId") Long trId);

    String selectInitDate(@Param("companyId") Long companyId, @Param("personId") Long personId);

    int insertRealTr(@Param("trId") Long trId, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") RealTrSaveReq req);

    int updateRealTr(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") RealTrSaveReq req);

    int clearRealTr(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("trId") Long trId);

    String selectBizDate(@Param("companyId") Long companyId, @Param("baseDate") String baseDate);

    EmpLimitRes selectEmpLimit(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    List<RelateApprRes> selectRelateApprs(@Param("personId") Long personId, @Param("stdDate") String stdDate);

    ReportEmpRes selectReportEmp(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    String selectWorkingYn(@Param("stdDate") String stdDate);

    String selectPreReportDate(@Param("companyId") Long companyId, @Param("checkCycle") String checkCycle, @Param("stdDate") String stdDate);

    int countAccount(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("preStdDate") String preStdDate);

    int countReport(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    int countNextReport(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    String insertFloorTrBook(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") String startDate);

    int clearApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("apprId") Long apprId);

    int insertApprDel(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("apprId") Long apprId);

    int deleteAppr(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("apprId") Long apprId);

    List<Long> selectAccountIdsByNo(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountNo") String accountNo);

    Boolean selectStkPriceYn(@Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode, @Param("stdDate") String stdDate);

    List<String> selectItemNamesByCode(@Param("itemCode") String itemCode);

    int insertExcelTr(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountId") Long accountId,
                      @Param("trDate") java.time.LocalDate trDate, @Param("trType") String trType, @Param("trItemType") String trItemType,
                      @Param("trItemName") String trItemName, @Param("trItemCode") String trItemCode,
                      @Param("trQty") Double trQty, @Param("trAmt") Long trAmt);

    /** AS-IS flt10_tr.selectByTrType (계좌대체 30N) */
    List<AcntTransferRes> selectAcntTransfers(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("accountId") Long accountId, @Param("startDate") String startDate,
                                              @Param("closeDate") String closeDate, @Param("searchText") String searchText);

    AcntTransferRes selectAcntTransferById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("trId") Long trId);

    int insertAcntTransfer(@Param("trId") Long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                           @Param("req") AcntTransferSaveReq req);

    int updateAcntTransfer(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") AcntTransferSaveReq req);

    /** AS-IS flt10_tr.selectByTrType (권리행사/기타입출고, 매매구분 FloorTrCode0002 그룹) */
    List<RightsExerciseRes> selectRightsExercises(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                  @Param("trType") String trType, @Param("accountId") Long accountId,
                                                  @Param("startDate") String startDate, @Param("closeDate") String closeDate,
                                                  @Param("searchText") String searchText);

    RightsExerciseRes selectRightsExerciseById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("trId") Long trId);

    int insertRightsExercise(@Param("trId") Long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                             @Param("req") RightsExerciseSaveReq req);

    int updateRightsExercise(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") RightsExerciseSaveReq req);

    /** AS-IS flt10_tr.insertFloorTrBook — 종목 한정 */
    String insertFloorTrBookItem(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("itemType") String itemType,
                                 @Param("itemName") String itemName, @Param("itemCode") String itemCode, @Param("startDate") String startDate);
}
