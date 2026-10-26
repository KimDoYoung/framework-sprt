package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/**
 * 공모주청약 한 건 — AS-IS Fnd30_OprModel (fnd30_opr.selectByDate · selectById, oprCode "01"). 결재문서가 없으면 apprId·apprStatusCode는 null.
 * corpName은 SQL 계산 열(f_get_corp_nm), demandId는 수요예측에서 만든 청약이면 그 수요예측 ID
 */
public record OprSubRes(Long oprId, String oprCode, LocalDate subscriptionDate, String itemName, Long corpId, String corpName,
                        Long price, Double feeRate, LocalDate payDate, Long qty, String lockPeriod, Long apprId,
                        String apprStatusCode, String apprStatusName, String note, Long demandId) {
}
