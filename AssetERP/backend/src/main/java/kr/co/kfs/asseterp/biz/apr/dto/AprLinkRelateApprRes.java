package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * 링크 문서를 열자마자 연관문서 탭에 들어가는 문서 한 줄 (AS-IS Apr03_Page_Relate.insertRelateApprList L517-552의 Apr21_RelateApprModel, V23).
 * 구분 이름(대외/사내)은 화면이 inOutTypeCode로 만든다.
 */
public record AprLinkRelateApprRes(Long targetApprId, LocalDate regDate, String title, String inOutTypeCode) {
}
