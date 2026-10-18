package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류(C) 저장 (Dcr01_Edit_ClassTree). 새 분류는 parentTreeId만 정해서 보낸다 */
public record DcrClassTreeSaveReq(Long parentTreeId, String classTreeName, String classTreeCode, String seq, String note) {
}
