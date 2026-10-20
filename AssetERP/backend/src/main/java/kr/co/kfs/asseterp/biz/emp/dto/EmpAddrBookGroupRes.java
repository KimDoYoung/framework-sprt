package kr.co.kfs.asseterp.biz.emp.dto;

/** 주소록 그룹 한 행 (AS-IS Emp57_AddrBookGroupModel — Emp57_Lookup_Insert 왼쪽 그리드, G11). personId = 등록자 */
public record EmpAddrBookGroupRes(Long addrBookGroupId, String groupName, String publicYn, Long personId, String personName) {
}
