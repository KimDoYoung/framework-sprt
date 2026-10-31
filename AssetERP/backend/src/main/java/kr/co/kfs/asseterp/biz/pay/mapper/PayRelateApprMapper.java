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

    /** AS-IS pay05_relate_appr.insert — 퇴직정산 상신 행(지급일은 퇴직정산 급여의 지급일자) (V18) */
    int insertRetire(Long relateApprId, Long companyId, Long monthId);

    /** AS-IS pay05_relate_appr.updateApprId — 회사 출금계좌는 지급일 기준 최신 계좌(pay03_account.selectByStartDate) (V18) */
    int updateApprId(Long relateApprId, Long companyId, Long apprId);

}
