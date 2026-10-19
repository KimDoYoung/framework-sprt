package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 문서작성 목록 한 행 (AS-IS Apr01_ApprModel 중 Dcr01_Tab_DcrWrite 그리드가 쓰는 열) — 큰 ID는 15자리 이하라 숫자 그대로 */
public record AprDcrWriteRes(Long apprId, String bookmarkYn, LocalDateTime regDate, LocalDateTime effectDate, String regEmpName,
                             String classTreeName, String title, String receiveName, String relateDisplayName,
                             String statusNameBold, String note) {
}
