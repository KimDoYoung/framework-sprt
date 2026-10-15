package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS Sys10_FileModel — selectByTotalSizeMonth (월별 사용용량, MB) */
public record FileMonthRes(Long fileId, String month, Double totalSize) {
}
