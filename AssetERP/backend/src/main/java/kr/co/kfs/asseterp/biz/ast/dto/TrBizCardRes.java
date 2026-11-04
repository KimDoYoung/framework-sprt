package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/**
 * 법인카드 사용내역의 비품대장 거래 한 건 (AS-IS ast06_tr.selectByCardApprovalNo — Ast06_Lookup_TrBizCard 편집 값).
 * 거래가 아직 없으면 trId·거래유형·거래처·종목은 비고 일자(카드 승인일)·적요만 채워 돌려준다(AS-IS insertRow)
 */
public record TrBizCardRes(Long trId, LocalDate date, String trCode, String trName, Long corpId, String corpName,
                           Long astClassTreeId, String classTreeFullName, String note, String cardApprovalNo) {
}
