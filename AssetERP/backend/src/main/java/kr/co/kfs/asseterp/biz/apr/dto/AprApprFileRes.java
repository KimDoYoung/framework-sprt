package kr.co.kfs.asseterp.biz.apr.dto;

/** 첨부파일 탭 한 줄 (sys10_file.selectByParentId 중 Apr01_Grid_ApprFile 열, V01). fileYn이 true면 "확정문서" */
public record AprApprFileRes(Long fileId, String fileName, String fileExt, String fileYn, String printYn) {
}
