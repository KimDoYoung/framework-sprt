package kr.co.kfs.asseterp.biz.sch.dto;

/** 알람 설정 저장 (AS-IS sch.Sch11_IpoCompany.update → UpdateDataModel): 행이 없으면(id 0 이하) INSERT, 있으면 알람 6칸 UPDATE */
public record Sch11IpoCompanySaveReq(Long ipoCompanyId, Boolean demandSdateAlarmYn, Boolean demandCdateAlarmYn, Boolean subscriptionSdateAlarmYn,
                                     Boolean subscriptionCdateAlarmYn, Boolean payDateAlarmYn, Boolean listDateAlarmYn) {
}
