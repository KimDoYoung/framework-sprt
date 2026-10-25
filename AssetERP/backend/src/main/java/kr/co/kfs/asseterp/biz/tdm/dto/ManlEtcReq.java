package kr.co.kfs.asseterp.biz.tdm.dto;

/** 허용항목 수정 (AS-IS tdm.Tdm43_Manl.updateEtc) — stdDate는 저장 뒤 다시 읽는 목록 행의 기준일('yyyy-MM-dd'), startDate도 같은 형식(없으면 null) */
public record ManlEtcReq(String stdDate, String ceoDutyCode, String exctDutyMap, String importLevelCode, String startDate, String checkEvidDocName) {
}
