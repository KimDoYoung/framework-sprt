package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.InvestLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeCodeRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt10_tr.xml, flt01_company_std.xml, flt02_emp.xml, flt03_account.xml, flt08_buy_lockup.xml + UpdateDataModel(flt10_tr) */
@Mapper
public interface FltTrMapper {

    // flt10_tr
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
}
