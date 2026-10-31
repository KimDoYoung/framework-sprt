package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** 반려 문서의 첨부파일 삭제 (AS-IS Sys61_FileDel.insert) — 사유와 함께 삭제 내역으로 옮긴다 */
public record AprFileDelReq(List<Long> fileIds, String reason) {
}
