package kr.co.kfs.asseterp.biz.fbx.dto;

import java.time.LocalDateTime;

/** 파일보관함 저장 한 행 (AS-IS fbx.Fbx01_Box.update) — boxId가 없거나 0 이하면 새 행 */
public record FbxBoxSaveReq(Long boxId, LocalDateTime crtDate, String title, String note, String statusCd) {
}
