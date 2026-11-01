package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/**
 * AS-IS ast.Ast06_Tr.selectByPayCode · selectById (고유자산 거래처리 X03, Ast06_Tab_TrIntrinsic) — 그리드 열 + 편집창 값.
 * 원본은 `ast06_tr.*, ast08_tr_finance.*`를 모두 읽지만 이 화면이 쓰는 열만 둔다
 */
public record TrIntrinsicRes(
        Long trId,
        LocalDate date,
        String trCode,
        String trName,
        Long corpId,
        String corpName,
        Long astClassTreeId,
        String classTreeName,
        String classTreeFullName,
        String itemLClassCode,
        String itemMClassCode,
        String itemSClassCode,
        String curCode,
        Long contAmt,
        Long tax,
        Long amt,
        boolean settleMngYn,
        Long depositId,
        String depositName,
        String note,
        Long personId,
        String personName,
        Long journalId,
        Long apprId,
        String apprCnt,
        Long dcrClassTreeId,
        String rcvPayCode,
        boolean financeYn,
        String bookIoType,
        Long purTrId,
        Long bookAmt,
        Long unSettleAmt,
        /** 외화 거래(X08)만 쓴다 — 적용환율·외화금액 */
        Double fxRate,
        Double forAmt
) {
}
