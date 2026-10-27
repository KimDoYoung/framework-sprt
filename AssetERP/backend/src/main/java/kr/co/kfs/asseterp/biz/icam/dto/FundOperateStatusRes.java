package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

public record FundOperateStatusRes(
        Long fundBookId,
        LocalDate stdDate,
        Long principal,
        Long nav,
        Long totalAsset,
        Long navAvg,
        Long totalAssetAvg
) {
}
