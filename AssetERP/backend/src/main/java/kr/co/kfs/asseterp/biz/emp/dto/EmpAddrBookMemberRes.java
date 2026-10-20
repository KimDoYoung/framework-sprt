package kr.co.kfs.asseterp.biz.emp.dto;

/** 그룹에 속한 담당자·사원 한 행 (AS-IS Emp57_AddrBookGroupModel — Emp57_TabPage_Insert 그리드, G11). parentGubun = 외부/사내 */
public record EmpAddrBookMemberRes(Long addrBookGroupId, Long parentId, Long relateId, String note,
                                   String parentGubun, String parentName, String emailAddress, String mobileTelNo) {
}
