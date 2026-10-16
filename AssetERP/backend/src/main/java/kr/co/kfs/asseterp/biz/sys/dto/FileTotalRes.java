package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS Sys10_FileModel — selectByTotalSize (고객별 누적 사용용량, MB) */
public record FileTotalRes(Long fileId, String companyNm, String locNm, Double totalSize, Double runningTotalSize) {
}
