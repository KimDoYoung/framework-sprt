package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** 차량정보 한 행 (AS-IS Car01_InfoModel — 그리드 7열 + 편집 폼 항목) */
public record CarInfoRes(Long infoId, String carType, String carTypeNm, String carNo, String carNm, String carInfo, String note,
                         Long initMileage, String personNm, LocalDate startDate) {
}
