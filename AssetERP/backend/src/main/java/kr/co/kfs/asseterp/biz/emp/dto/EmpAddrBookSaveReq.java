package kr.co.kfs.asseterp.biz.emp.dto;

/** 주소록 저장 한 행 (G11·G12). addrBookId가 없거나 0 이하면 새 행 — 등록자는 서버가 로그인 사원으로 채운다 */
public record EmpAddrBookSaveReq(Long addrBookId, String contactName, String emailAddress, String mobileTelNo, String officeTelNo,
                                 String companyName, String posName, String note, String publicYn) {
}
