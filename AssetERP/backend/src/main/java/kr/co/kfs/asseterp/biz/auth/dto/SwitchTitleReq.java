package kr.co.kfs.asseterp.biz.auth.dto;

/** 겸직전환 요청 (AS-IS Emp04_Lookup_AddTitleList.login → sys.Sys02_User.getChangeInfo: 전환할 사원 ID) */
public record SwitchTitleReq(Long addPersonId) {
}
