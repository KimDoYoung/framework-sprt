package kr.co.kfs.asseterp.biz.apr.dto;

/** 임시저장 문서를 지울 때 함께 지울 첨부파일 (AS-IS sys10_file.deleteCheck) */
public record AprFileDelRow(Long fileId, String serverPath) {
}
