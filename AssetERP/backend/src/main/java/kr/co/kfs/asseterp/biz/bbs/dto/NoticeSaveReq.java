package kr.co.kfs.asseterp.biz.bbs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * 공지 저장 (AS-IS Bbs02_Edit_Notice.update → bbs.Bbs02_Notice.update + bbs.Bbs03_Target.update).
 * noticeId는 화면이 미리 받아 둔 새 ID(next-id) 또는 기존 공지의 ID. newTargetPersonIds = 이번에 [등록]·[그룹]으로 더한 개별 대상자
 */
public record NoticeSaveReq(@NotNull Long noticeId, @NotBlank String title, String notice, @NotBlank String fromDate, @NotBlank String toDate,
                            String openYn, String note, @NotBlank String noticeType, String noticeDetailCode, boolean commentYn,
                            boolean topNoticeYn, String topNoticeCloseDate, List<Long> newTargetPersonIds) {
}
