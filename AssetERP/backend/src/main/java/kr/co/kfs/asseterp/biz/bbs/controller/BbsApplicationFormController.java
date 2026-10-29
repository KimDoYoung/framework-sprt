package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationFormContentReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationFormRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationFormSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsApplicationFormService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 신청구분 내용 양식 (AS-IS Bbs12_Lookup_ApplicationMng → server/bbs/Bbs12_ApplicationForm) */
@RestController
@RequestMapping("/api/v1/bbs/application-forms")
@RequiredArgsConstructor
public class BbsApplicationFormController {

    private final BbsApplicationFormService service;

    /** AS-IS bbs.Bbs12_ApplicationForm.formCheck + selectByCompanyId */
    @GetMapping
    public ApiResponse<List<ApplicationFormRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS bbs.Bbs12_ApplicationForm.update (공개여부) → 고친 건수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ApplicationFormSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS bbs.Bbs12_ApplicationForm.modelUpdate */
    @PutMapping("/{applicationFormId}/content")
    public ApiResponse<Void> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long applicationFormId,
                                           @RequestBody ApplicationFormContentReq req) {
        service.updateContent(principal, applicationFormId, req);
        return ApiResponse.ok(null);
    }
}
