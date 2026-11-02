package kr.co.kfs.asseterp.biz.bbs.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeAdminSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeHistoryRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeSendMessageReq;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetCompanyRes;
import kr.co.kfs.asseterp.biz.bbs.service.BbsNoticeAdminService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** KFS공지등록 (AS-IS Bbs02_Tab_NoticeAdmin·Bbs02_Edit_NoticeAdmin·Bbs09_Lookup_History, Z04) */
@RestController
@RequestMapping("/api/v1/bbs/notice-admin")
@RequiredArgsConstructor
public class BbsNoticeAdminController {

    private final BbsNoticeAdminService service;

    /** AS-IS bbs.Bbs02_Notice.selectByPublicYnPaging. 구분·구분상세는 코드('%'면 전체), 상태는 '알림'·'대기'·그 밖은 전체 */
    @GetMapping
    public ApiResponse<PageRes<NoticeAdminRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(defaultValue = "%") String openYn,
                                                       @RequestParam(defaultValue = "%") String noticeType,
                                                       @RequestParam(defaultValue = "%") String noticeDetail,
                                                       @RequestParam(defaultValue = "") String searchText,
                                                       @RequestParam(required = false) String startDate,
                                                       @RequestParam(required = false) String closeDate,
                                                       @RequestParam long offset,
                                                       @RequestParam long limit) {
        return ApiResponse.ok(service.search(principal, openYn, noticeType, noticeDetail, searchText, startDate, closeDate, offset, limit));
    }

    /** 새 공지의 ID (AS-IS DBUtil.setSeq) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.nextId(principal));
    }

    /** AS-IS bbs.Bbs09_NoticeHistory.insert + bbs.Bbs02_Notice.modelUpdate + bbs.Bbs04_TargetCompany.update */
    @PutMapping
    public ApiResponse<NoticeAdminRes> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody NoticeAdminSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS bbs.Bbs02_Notice.delete */
    @DeleteMapping("/{noticeId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId) {
        service.delete(principal, noticeId);
        return ApiResponse.ok(null);
    }

    /** AS-IS bbs.Bbs04_TargetCompany.selectByNoticeId */
    @GetMapping("/{noticeId}/target-companies")
    public ApiResponse<List<TargetCompanyRes>> searchTargetCompanies(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId) {
        return ApiResponse.ok(service.searchTargetCompanies(principal, noticeId));
    }

    /** AS-IS bbs.Bbs04_TargetCompany.delete (체크한 고객사) */
    @DeleteMapping("/{noticeId}/target-companies")
    public ApiResponse<Integer> deleteTargetCompanies(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId,
                                                      @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteTargetCompanies(principal, noticeId, ids));
    }

    /** AS-IS bbs.Bbs04_TargetCompany.deleteAllTarget */
    @DeleteMapping("/{noticeId}/target-companies/all")
    public ApiResponse<Void> deleteAllTargetCompanies(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId) {
        service.deleteAllTargetCompanies(principal, noticeId);
        return ApiResponse.ok(null);
    }

    /** AS-IS bbs.Bbs09_NoticeHistory.selectByNoticeId */
    @GetMapping("/{noticeId}/histories")
    public ApiResponse<List<NoticeHistoryRes>> searchHistories(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId) {
        return ApiResponse.ok(service.searchHistories(principal, noticeId));
    }

    /** AS-IS sms.Sms03_GroupSend.sendNoticeMessage */
    @PostMapping("/send-message")
    public ApiResponse<Void> sendMessage(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody NoticeSendMessageReq req) {
        service.sendNoticeMessage(principal, req.message(), req.personIds());
        return ApiResponse.ok(null);
    }
}
