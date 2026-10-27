package kr.co.kfs.asseterp.biz.est.dto;

/** 증빙자료 저장 행 (AS-IS est.Est04_PfFile.update). pfFileId는 [행 추가] 때 받은 새 번호 또는 기존 행 */
public record PfFileSaveReq(Long pfFileId, String fileDesc, String checkRoute) {
}
