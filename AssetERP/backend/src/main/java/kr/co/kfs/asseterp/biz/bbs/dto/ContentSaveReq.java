package kr.co.kfs.asseterp.biz.bbs.dto;

import jakarta.validation.constraints.NotNull;

/**
 * 게시물 저장 (AS-IS bbs.Bbs31_Content.modelUpdate). contentId는 화면이 미리 받아 둔 새 ID(next-id)이거나 기존 게시물 ID.
 * editChk = AS-IS request.getBooleanParam("editchk") — true면 수정(등록일·시각 그대로), false면 새 글(등록일·시각 = 지금)
 */
public record ContentSaveReq(@NotNull Long contentId, Long classTreeId, String title, String content, boolean hideYn, boolean editChk) {
}
