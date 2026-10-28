package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayRelateApprRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay05_relate_appr.xml — 급여대장 상신(S18) */
@Mapper
public interface PayRelateApprMapper {
    /** AS-IS selectByCompanyId */
    List<PayRelateApprRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("payCode") String payCode,
                                             @Param("payDate") LocalDate payDate);

    /** AS-IS selectByRetire (S22) — 퇴직정산서(monthId)의 상신 상태 */
    List<PayRelateApprRes> selectByRetire(@Param("companyId") Long companyId, @Param("monthId") Long monthId);
}
