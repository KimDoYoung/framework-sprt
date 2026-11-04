package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsNoticeTargetRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeMngRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticePersonRes;
import kr.co.kfs.asseterp.biz.bbs.dto.NoticeSaveReq;
import kr.co.kfs.asseterp.biz.bbs.dto.TargetRes;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    // ── Z02 공지사항 등록 ──

    /** AS-IS bbs.Bbs02_Notice.selectByCompanyIdPaging (Bbs02_Tab_NoticeManager·Bbs02_Lookup_LoadBbs) */
    @GetMapping("/manage")
    public ApiResponse<PageRes<NoticeMngRes>> searchByCompanyId(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(defaultValue = "%") String noticeType,
                                                                @RequestParam(defaultValue = "%") String noticeDetail,
                                                                @RequestParam(defaultValue = "") String searchText,
                                                                @RequestParam(defaultValue = "false") boolean systemNoticeYn,
                                                                @RequestParam long offset,
                                                                @RequestParam long limit) {
        return ApiResponse.ok(service.searchByCompanyId(principal, noticeType, noticeDetail, searchText, systemNoticeYn, offset, limit));
    }

    /** 새 공지의 ID (AS-IS GridInsertRow setSeq) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS bbs.Bbs02_Notice.update + bbs.Bbs03_Target.update — noticeId가 없는 행이면 등록, 있으면 수정 */
    @PutMapping("/manage")
    public ApiResponse<NoticeMngRes> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody NoticeSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS bbs.Bbs02_Notice.delete */
    @DeleteMapping("/manage/{noticeId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId) {
        service.delete(principal, noticeId);
        return ApiResponse.ok(null);
    }

    /** AS-IS bbs.Bbs03_Target.selectByNoticeId */
    @GetMapping("/{noticeId}/targets")
    public ApiResponse<List<TargetRes>> searchTargets(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId,
                                                      @RequestParam String fromDate) {
        return ApiResponse.ok(service.searchTargets(principal, noticeId, fromDate));
    }

    /** AS-IS bbs.Bbs03_Target.delete (체크한 대상자) */
    @DeleteMapping("/{noticeId}/targets")
    public ApiResponse<Integer> deleteTargets(@PathVariable Long noticeId, @RequestBody List<Long> targetIds) {
        return ApiResponse.ok(service.deleteTargets(noticeId, targetIds));
    }

    /** AS-IS bbs.Bbs03_Target.deleteAllTarget */
    @DeleteMapping("/{noticeId}/targets/all")
    public ApiResponse<Void> deleteAllTargets(@PathVariable Long noticeId) {
        service.deleteAllTargets(noticeId);
        return ApiResponse.ok(null);
    }

    /** AS-IS bbs.Bbs02_Notice.selectByTargetPerson (Frm01_Lookup_NoticeList) — 나에게 온 읽지 않은 알림 공지 */
    @GetMapping("/target-person")
    public ApiResponse<List<BbsNoticeTargetRes>> searchByTargetPerson(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchByTargetPerson(principal));
    }
}
