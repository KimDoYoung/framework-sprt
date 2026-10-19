package kr.co.kfs.asseterp.biz.act.dto;

/** 출력정보 및 사용여부 설정 저장 한 행 (AS-IS Act01_Lookup_PrintYn → act.Act01_AccountCode.update) */
public record AccountCodePrintSaveReq(Long accountCodeId, String accountName2, String printYn, String useYn) {
}
