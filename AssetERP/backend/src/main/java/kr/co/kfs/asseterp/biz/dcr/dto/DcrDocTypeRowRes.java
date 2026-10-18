package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서구분(T) 한 행 (AS-IS Dcr01_ClassTreeModel — selectByParentId). 문서구분 그리드(Dcr01_Grid_DocType)의 행 */
public record DcrDocTypeRowRes(Long classTreeId, Long companyId, Long parentTreeId, String classTreeName, String classTreeCode,
                               String seq, String note, String adminYn, String approvalTypeCode, String approvalTypeName,
                               Long apprStepGroupId, String apprStepGroupName, String sealCode, String sealName,
                               String compYn, String mngmYn, String printFundYn,
                               String formCountStr, String icsCountStr, String icrCountStr, String classTreeFullName) {
}
