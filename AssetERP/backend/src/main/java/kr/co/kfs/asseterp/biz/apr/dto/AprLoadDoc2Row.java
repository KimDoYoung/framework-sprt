package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** [불러오기] 창 목록 한 줄 (AS-IS Dcr00_DocListModel — docId는 화면 행 번호, content는 오른쪽 미리보기·가져올 본문) */
public record AprLoadDoc2Row(Long docId, Long apprId, LocalDateTime regDate, String title, String receiveName, String fundDisplayName, String statusName,
                             String empName, String classTreeName, boolean authYn, String statusCode, String content, String inOutTypeCode) {
}
