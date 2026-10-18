package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서구분(T) 저장 (Dcr01_Grid_DocType.update). classTreeId가 0 이하면 새 행, parentTreeId는 새 행만 쓴다 */
public record DcrDocTypeSaveReq(Long classTreeId, Long parentTreeId, String classTreeName, String classTreeCode, String seq, String note,
                                String approvalTypeCode, Long apprStepGroupId, String sealCode,
                                String compYn, String mngmYn, String printFundYn) {
}
