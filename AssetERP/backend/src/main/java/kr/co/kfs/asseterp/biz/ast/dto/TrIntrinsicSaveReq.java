package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * AS-IS ast.Ast06_Tr.update / updateDepn (X03 Ast06_Lookup_TrIntrinsic) — trId가 없으면 새 거래(NEW).
 * 종목 대분류가 50·55이거나 소분류가 952002면 비품원장(updateDepn)까지 만든다(AS-IS 클라이언트가 서비스 이름을 고르던 분기를 서버가 한다).
 * selfPur: 원장 입출고 거래가 아니면(AS-IS `!isBookYn()`) 장부금액 = 거래금액, 취득거래ID = 이 거래 자신(새 거래면 새 ID)
 */
public record TrIntrinsicSaveReq(
        Long trId,
        @NotNull LocalDate date,
        String trCode,
        Long corpId,
        Long astClassTreeId,
        Long contAmt,
        Long tax,
        Long amt,
        boolean settleMngYn,
        Long depositId,
        String note,
        String curCode,
        Long purTrId,
        Long bookAmt,
        String itemLClassCode,
        String itemSClassCode,
        boolean selfPur,
        /** 외화 거래 고유자산 거래처리(X08)면 true — 적용환율·외화금액을 저장하고 감가상각·비품원장은 건너뛴다(AS-IS ast.Ast06_Tr.update) */
        boolean foreign,
        Double fxRate,
        Double forAmt
) {
}
