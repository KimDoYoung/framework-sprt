package kr.co.kfs.asseterp.biz.act.dto;

/** 제공내역에 계정과목 연결 추가 (AS-IS Act14_Lookup_LinkProvideContent.insertAccount → act.Act14_Link.modelUpdate). seq는 화면의 현재 행 수 + 1 */
public record ActLinkContentAddReq(String accountCode, String provideContentCode, Long seq) {
}
