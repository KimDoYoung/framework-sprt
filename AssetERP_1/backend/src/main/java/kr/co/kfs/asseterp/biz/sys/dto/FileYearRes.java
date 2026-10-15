package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS Sys10_FileModel — selectByTotalSizeYear (연도별 사용용량, MB) */
public record FileYearRes(Long fileId, String year, Double totalSize) {
}
