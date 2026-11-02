package kr.co.kfs.asseterp.biz.emp.dto;

/**
 * 그룹선택 창(Emp57_Lookup_List)이 돌려주는 그룹 담당자 한 행 (AS-IS Emp57_AddrBookGroupModel — selectByParentId 전체 열).
 * 사내 담당자는 relateId = 사원 ID, orgName·titleName·empNo·empName이 차 있다
 */
public record EmpAddrBookSelectRes(Long addrBookGroupId, Long relateId, String parentGubun, String parentName, String emailAddress,
                                   String mobileTelNo, String contacterName, String orgName, String titleName, String empNo, String empName,
                                   String note) {
}
