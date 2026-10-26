package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/**
 * 공모주청약 등록·수정 (AS-IS Fnd30_Edit_Opr.update → fnd.Fnd30_Opr.modelUpdate · multiUpdate).
 * insertCount는 신규일 때만(1보다 크면 같은 내용을 건수만큼 등록), demandId는 수요예측 신청내역에서 등록할 때만(AS-IS demandOprYn — 펀드별 배정을 수요예측 비율로 함께 만든다)
 */
public record OprSubSaveReq(LocalDate subscriptionDate, LocalDate payDate, String itemName, Long corpId, Long price, Double feeRate,
                            Long qty, String lockPeriod, String note, Integer insertCount, Long demandId) {
}
