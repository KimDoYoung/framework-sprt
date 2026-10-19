package kr.co.kfs.asseterp.biz.apr.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** 다운로드한 문서들 (AS-IS Apr40_DownloadHistory.updateList의 selectList) */
public record AprDownloadHistorySaveReq(@NotEmpty List<Long> apprIds) {
}
