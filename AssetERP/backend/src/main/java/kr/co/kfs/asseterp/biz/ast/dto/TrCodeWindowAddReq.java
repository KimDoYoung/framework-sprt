package kr.co.kfs.asseterp.biz.ast.dto;

/** 화면 등록: 화면 찾기에서 고른 메뉴의 Class명 (관리자 회사는 companyId로 운용사 지정) */
public record TrCodeWindowAddReq(Long companyId, String windowClassName) {
}
