package kr.co.kfs.asseterp.biz.emp.dto;

/** 주소록 한 행 (AS-IS Emp10_AddrBookModel — Emp10_Tab_AddrBook·PublicAddrBook 그리드, G11·G12). publicYn은 'true'/'false' 문자열 */
public record EmpAddrBookRes(Long addrBookId, String contactName, String emailAddress, String mobileTelNo, String officeTelNo,
                             String companyName, String posName, String note, String publicYn, Long personId, String personName) {
}
