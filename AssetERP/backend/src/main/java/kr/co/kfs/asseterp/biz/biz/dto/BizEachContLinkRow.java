package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 계약사관리 개별계약서(C01) 결재창 제목·본문 재료 — biz16_each_contract 한 건 + 계약사의 최신 계약 이력(biz11)의 이름·주소·대표이사 */
public record BizEachContLinkRow(String fundName, String fundFee, LocalDate contDate, LocalDate fundStartDate, String note,
                                 String contCorpName, String address, String ceo) {
}
