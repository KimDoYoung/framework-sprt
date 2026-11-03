package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/**
 * biz22_fee_charge_calc 한 행 — 구간 계산 정보(Biz22_Lookup_FeeChargeCalc 와 자료생성 계산이 함께 쓴다, EE21).
 * 자료생성이 구간마다 값을 채워 넣는 작업 모델이라 필드를 바꿀 수 있게 열어 두었다(AS-IS Biz22_FeeChargeCalcModel 의 setter 대신).
 * 예/아니오 열(minFeeYn·withYn)은 DB 가 'true'/'false' 글자다.
 */
public class BizFeeChargeCalc {
    public Long feeChargeCalcId;
    public Long contCorpId;
    public LocalDate chargeDate;
    public LocalDate termStartDate;
    public LocalDate termCloseDate;
    public Long termDays;
    public String minFeeYn;
    public Long manageMinFee;
    public Long manageTermMinFee;
    public Long manageTermOccFee;
    public Long manageTermWithFee;
    public Long manageTermChargeFee;
    public Long advMinFee;
    public Long advTermMinFee;
    public Long advTermOccFee;
    public Long advTermWithFee;
    public Long advTermChargeFee;
    public Long discrMinFee;
    public Long discrTermMinFee;
    public Long discrTermOccFee;
    public Long discrTermWithFee;
    public Long discrTermChargeFee;
    public String withYn;
    public Long withFee;
    public Long withTermWithFee;
    public Long withTermOccFee;
    public Long withTermChargeFee;
}
