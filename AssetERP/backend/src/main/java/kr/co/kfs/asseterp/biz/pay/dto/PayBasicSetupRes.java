package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여공제 기본설정 (S28, AS-IS Pay30_BasicSetupModel — pay30_basic_setup.selectByCompanyId) */
public record PayBasicSetupRes(Long basicSetupId, Long companyId, Long withHoldRate,
                               String hiDivPayCode, Long hiMaxDiv, String eiDivPayCode, Long eiMaxDiv) {
}
