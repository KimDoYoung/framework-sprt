package kr.co.kfs.asseterp.biz.batch.dto;

/** 파일 존재 점검 대상 (AS-IS sys10_file.selectByYear 중 쓰는 열). 실제 파일은 {serverPath}/{fileId} */
public record BatchFileRow(Long fileId, String serverPath, Double size) {
}
