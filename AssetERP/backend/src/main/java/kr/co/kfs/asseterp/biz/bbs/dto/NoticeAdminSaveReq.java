package kr.co.kfs.asseterp.biz.bbs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * KFS공지 저장 (AS-IS Bbs02_Edit_NoticeAdmin.update → bbs.Bbs09_NoticeHistory.insert + bbs.Bbs02_Notice.modelUpdate + bbs.Bbs04_TargetCompany.update).
 * latestOpenYn·latestNotice = 창을 열 때 읽은 상태·본문(기록 판단용, 새 공지는 null). newTargetCompanyIds = 이번에 [등록]으로 더한 개별 고객사
 */
public record NoticeAdminSaveReq(@NotNull Long noticeId, @NotBlank String title, String notice, @NotBlank String fromDate, @NotBlank String toDate,
                                 String openYn, String note, @NotBlank String noticeType, String noticeDetailCode, boolean publicYn,
                                 boolean publicCompanyYn, String latestOpenYn, String latestNotice, List<Long> newTargetCompanyIds) {
}
