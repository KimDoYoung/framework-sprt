package kr.co.kfs.asseterp.biz.emp.dto;

/** 그룹 담당자 저장 한 행 (G11). addrBookGroupId가 없거나 0 이하면 새 행(parentId·relateId 필요), 수정은 비고만 바뀐다 */
public record EmpAddrBookMemberSaveReq(Long addrBookGroupId, Long parentId, Long relateId, String note) {
}
