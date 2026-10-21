package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt08_buy_lockup.xml + UpdateDataModel(flt08_buy_lockup) — J09 매수제한종목 */
@Mapper
public interface FltBuyLockupMapper {

    /** AS-IS selectByText (lockupType·searchText는 LIKE 패턴) */
    List<BuyLockupItemRes> selectByText(@Param("companyId") Long companyId, @Param("lockupType") String lockupType, @Param("searchText") String searchText);

    BuyLockupItemRes selectById(@Param("buyLockupId") Long buyLockupId);

    Long selectNextId();

    int insertBuyLockup(@Param("buyLockupId") Long buyLockupId, @Param("companyId") Long companyId, @Param("req") BuyLockupSaveReq req);

    int updateBuyLockup(@Param("companyId") Long companyId, @Param("req") BuyLockupSaveReq req);

    int deleteBuyLockups(@Param("companyId") Long companyId, @Param("buyLockupIds") List<Long> buyLockupIds);
}
