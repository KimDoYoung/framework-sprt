package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여공제 기본설정 저장 (S28, AS-IS pay.Pay30_BasicSetup.modelUpdate) — 회사는 서버가 로그인 사용자로 정한다 */
public record PayBasicSetupSaveReq(Long basicSetupId, Long withHoldRate,
                                   String hiDivPayCode, Long hiMaxDiv, String eiDivPayCode, Long eiMaxDiv) {
}
