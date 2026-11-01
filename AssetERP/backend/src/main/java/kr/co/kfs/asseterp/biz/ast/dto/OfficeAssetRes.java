package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 비품관리대장 한 줄 (ast13_book_depn.selectOfficeAssets) — 그리드 9열 + 소분류 코드(폐기 가능 판정) */
public record OfficeAssetRes(Long bookDepnId, String itemType, LocalDate purDate, String itemName, String note, Long purAmt,
                             String corpName, String corpTel, LocalDate retireDate, String itemSClassCode, Long purTrId) {
}
