package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

/** 감가상각 [처리] 요청(W11) — AS-IS는 선택한 Ast06_TrModel 목록을 그대로 보낸다. evalYear는 날짜에서 구한다 */
public record DepnProcessReq(@NotEmpty List<Item> items) {

    public record Item(Long trId, Long astClassTreeId, LocalDate date, Long purTrId, LocalDate purDate, Long bookAmt,
                       Long nonDeductTax, Long acmDepnCost, Long depnCost, String depnType, Long depnYear,
                       Double depnRate, LocalDate calcStartDate, String classTreeName) {
    }
}
