package kr.co.kfs.asseterp.biz.biz.dto;

/** 거래상대방 조회창 한 행 (AS-IS Biz01_Lookup_ProvideCompany — 회사의 기존 거래상대방 이름, rowId는 행 구분용 일련번호) */
public record BizProvideCompanyRes(Long rowId, String provideCompany) {
}
