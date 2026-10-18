package kr.co.kfs.asseterp.biz.dcr.dto;

/** 연결 법규·내규 저장 (Dcr20_Lookup_Ics·Dcr21_Lookup_Icr). 새 행만 오므로 relateId는 쓰지 않고 서버가 채번한다 */
public record DcrRelateSaveReq(Long relateId, Long dcrClassTreeId, Long targetClassTreeId, String note) {
}
