package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS ast05_tr_code.selectByWindowClassName (Ast05_Lookup_TrCodeWindow) — 화면별 거래유형. astClassTreeId는 4대보험 등록이 새 거래에 넘긴다, bookIoType은 금융상품 거래처리(W06)가 종목 선택 방식을 가른다(act11_tr_map) */
public record TrCodeByWindowRes(Long trCodeId, Long companyId, String trCode, String trName, String rcvPayCode, String rcvPayName,
                                Long astClassTreeId, String note, String bookIoType) {
}
