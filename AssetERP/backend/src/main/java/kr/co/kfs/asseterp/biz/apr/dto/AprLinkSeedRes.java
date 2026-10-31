package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 다른 화면이 링크코드로 결재창을 열 때의 제목·본문·시행일자 (Apr01_Edit_ApprDoc.insertLinkApproval L1524-2953, V17).
 * titleReadOnly/saveVisible은 AS-IS가 창을 열 때 정하는 값이다(기본: 제목 읽기전용, [저장] 숨김).
 */
public record AprLinkSeedRes(String linkCode, String title, String content, LocalDate effectDate, boolean titleReadOnly, boolean saveVisible, String receiveName, String referenceName,
                          String inOutTypeCode, List<AprLinkRelateApprRes> relateApprs) {
}
