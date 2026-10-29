package kr.co.kfs.asseterp.biz.car.dto;

/** 차량정보 저장 한 행 — infoId가 null이면 신규(AS-IS UpdateDataModel) */
public record CarInfoSaveReq(Long infoId, String carType, String carNo, String carNm, String carInfo, String note, Long initMileage) {
}
