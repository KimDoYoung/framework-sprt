package kr.co.kfs.asseterp.biz.sch.dto;

/** 고객사별 공모주 일정의 알람 설정 (AS-IS Sch11_IpoCompanyModel, 알람 6칸). 행이 없으면 서버가 돌려주지 않는다 */
public record Sch11IpoCompanyRes(Long ipoCompanyId, Long ipoId, Long companyId, Boolean demandSdateAlarmYn, Boolean demandCdateAlarmYn,
                                 Boolean subscriptionSdateAlarmYn, Boolean subscriptionCdateAlarmYn, Boolean payDateAlarmYn, Boolean listDateAlarmYn) {
}
