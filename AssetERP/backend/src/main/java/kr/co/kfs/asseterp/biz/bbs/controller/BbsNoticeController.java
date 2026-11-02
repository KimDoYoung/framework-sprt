package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticePersonRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeRes;
import kr.co.kfs.asseterp.biz.bbs.service.BbsNoticeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 공지사항 (AS-IS server/bbs/Bbs02_Notice, Bbs05_History) */
@RestController
@RequestMapping("/api/v1/bbs/notices")
@RequiredArgsConstructor
public class BbsNoticeController {

    private final BbsNoticeService service;

    /** AS-IS bbs.Bbs02_Notice.selectByNoticeDetailCodePaging (Bbs02_Tab_NoticeViewLaw). 법규공지는 noticeType 10, 경영공지(Bbs02_Tab_NoticeViewMgt)는 20 */
    @GetMapping
    public ApiResponse<PageRes<NoticeRes>> searchByNoticeDetailCode(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam(defaultValue = "10") String noticeType,
                                                                    @RequestParam(defaultValue = "%") String noticeDetailCode,
                                                                    @RequestParam(defaultValue = "") String searchText,
                                                                    @RequestParam long offset,
                                                                    @RequestParam long limit) {
        return ApiResponse.ok(service.searchByNoticeDetailCode(principal, noticeType, noticeDetailCode, searchText, offset, limit));
    }

    /** AS-IS bbs.Bbs02_Notice.selectByPersonIdPaging (Z03 Bbs02_Tab_NoticeView). 구분 전체는 '%', 기간은 구분이 전체일 때만 */
    @GetMapping("/mine")
    public ApiResponse<PageRes<NoticePersonRes>> searchByPersonId(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam(defaultValue = "%") String noticeType,
                                                                  @RequestParam(defaultValue = "%") String noticeDetailCode,
                                                                  @RequestParam(defaultValue = "") String searchText,
                                                                  @RequestParam(required = false) String startDate,
                                                                  @RequestParam(required = false) String closeDate,
                                                                  @RequestParam long offset,
                                                                  @RequestParam long limit) {
        return ApiResponse.ok(service.searchByPersonId(principal, noticeType, noticeDetailCode, searchText, startDate, closeDate, offset, limit));
    }

    /** AS-IS bbs.Bbs05_History.updatePersonId (Bbs02_Popup_NoticeAdmin "해당 공지사항 그만보기") */
    @PostMapping("/{noticeId}/history")
    public ApiResponse<Void> updatePersonId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId) {
        service.updatePersonId(principal, noticeId);
        return ApiResponse.ok(null);
    }
}
