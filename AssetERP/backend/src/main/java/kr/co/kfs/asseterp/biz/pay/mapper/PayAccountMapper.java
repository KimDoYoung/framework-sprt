package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayAccountRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayAccountSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay03_account.xml + UpdateDataModel(pay03_account) — 급여출금계좌(S18) */
@Mapper
public interface PayAccountMapper {
    /** AS-IS selectByCompanyId */
    List<PayAccountRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS selectByStartDate — 지급일 이전 시작일 중 가장 최근 1건 */
    PayAccountRes selectByStartDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    PayAccountRes selectById(@Param("companyId") Long companyId, @Param("accountId") Long accountId);

    Long selectNextId();

    int insert(@Param("accountId") Long accountId, @Param("companyId") Long companyId, @Param("req") PayAccountSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") PayAccountSaveReq req);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
