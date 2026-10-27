package kr.co.kfs.asseterp.biz.est.dto;

/** 수행내역 증빙자료 한 행 (AS-IS Est04_PfFileModel). fileId·fileName은 올린 파일(sys10_file), 없으면 null */
public record PfFileRes(Long pfFileId, Long pfHistoryId, String fileDesc, String checkRoute, Long fileId, String fileName) {
}
