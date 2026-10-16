package kr.co.kfs.asseterp.biz.sys.dto;

/** 휴일 저장 행 — 새 행은 ID가 0 이하. 회사는 서버가 로그인 회사로 넣는다(AS-IS insertRow의 LoginUser.getCompanyId()) */
public record HolidaySaveReq(Long holidayId, String day, String holidayName, String note) {
}
