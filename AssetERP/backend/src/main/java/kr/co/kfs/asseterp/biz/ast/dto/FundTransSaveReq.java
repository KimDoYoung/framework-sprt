package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;
import java.util.List;

/** AS-IS ast.Ast33_FundTrans.update 요청 목록. fundTransId가 없으면 새 행 */
public record FundTransSaveReq(List<Item> items) {

    public record Item(Long fundTransId, String fundTransCode, LocalDate date, Long corpId, String fundCode, String fundName,
                       Long fee, Double forFee, String curCode, String note, Long trId) {
    }
}
