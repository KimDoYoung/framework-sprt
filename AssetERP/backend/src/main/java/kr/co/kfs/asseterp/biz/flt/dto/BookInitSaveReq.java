package kr.co.kfs.asseterp.biz.flt.dto;

import java.time.LocalDate;

/** 최초원장 저장 한 줄 (AS-IS flt.Flt13_BookInit.update → UpdateDataModel). bookInitId가 0 이하면 새 행 */
public record BookInitSaveReq(Long bookInitId, LocalDate bookDate, Long accountId, String itemType, String itemName, String itemCode,
                              Double bookQty, Long bookAmt) {
}
