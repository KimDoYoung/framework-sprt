package kr.co.kfs.asseterp.biz.flt.dto;

/**
 * 매매내역조회 한 행 (AS-IS Flt10_TrModel · flt10_tr.selectByTrList, I08 Flt10_Tab_TrList).
 * 금액·수량은 출고(io_type 2)면 음수. statusCode·사유 열은 "사전승인" 칸을 눌렀을 때 보여 주는 값이다.
 */
public record TrListRes(
        Long trId,
        String accountNo,
        String inOutName,
        String trTypeName,
        String regDate,
        String itemName,
        Double expectTrQty,
        Long expectTrAmt,
        String statusCode,
        String statusName,
        String trDate,
        String trItemTypeName,
        String trItemName,
        Double trQty,
        Long trAmt,
        Double trPlRate,
        String trNote,
        String trReason,
        String rejectReason,
        String addConfirmReason) {
}
