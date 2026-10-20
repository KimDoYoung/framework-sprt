package kr.co.kfs.asseterp.biz.emp.dto;

/** 그룹 등록·수정 (AS-IS Emp57_Edit_GroupName → modelUpdate, G11). 등록자·회사는 서버가 로그인 정보로 채운다 */
public record EmpAddrBookGroupSaveReq(String groupName, String publicYn) {
}
