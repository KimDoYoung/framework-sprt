package kr.co.kfs.asseterp.biz.cmp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailBookRes;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailBookSaveReq;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckReq;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckRes;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailRoleRes;
import kr.co.kfs.asseterp.biz.cmp.service.CmpMailBookService;
import kr.co.kfs.asseterp.biz.cmp.service.CmpMailRoleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공용메일 관리 (AS-IS Cmp10_Tab_MailBook·Cmp10_Edit_Tab_MailBook → server/cmp/Cmp10_MailBook, G13) */
@RestController
@RequestMapping("/api/v1/cmp/mail-books")
@RequiredArgsConstructor
public class CmpMailBookController {

    private final CmpMailBookService service;
    private final CmpMailRoleService roleService;

    /** AS-IS cmp.Cmp10_MailBook.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<CmpMailBookRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS cmp.Cmp10_MailBook.modelUpdate (새 메일) */
    @PostMapping
    public ApiResponse<CmpMailBookRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CmpMailBookSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS cmp.Cmp10_MailBook.modelUpdate (고친 메일) */
    @PutMapping("/{mailBookId}")
    public ApiResponse<CmpMailBookRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long mailBookId,
                                              @RequestBody CmpMailBookSaveReq req) {
        return ApiResponse.ok(service.update(principal, mailBookId, req));
    }

    /** AS-IS cmp.Cmp11_MailRole.deleteByMailBookId + cmp.Cmp10_MailBook.delete — 지운 건수 */
    @DeleteMapping("/{mailBookId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long mailBookId) {
        return ApiResponse.ok(service.delete(principal, mailBookId));
    }

    /** AS-IS utils.mail.SendMailSMTP.checkCompanyMail — 시험 메일 발송 */
    @PostMapping("/check")
    public ApiResponse<CmpMailCheckRes> check(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CmpMailCheckReq req) {
        return ApiResponse.ok(service.check(principal, req));
    }

    /** AS-IS cmp.Cmp11_MailRole.selectByRoleId */
    @GetMapping("/{mailBookId}/roles")
    public ApiResponse<List<CmpMailRoleRes>> searchRoles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long mailBookId) {
        return ApiResponse.ok(roleService.search(principal, mailBookId));
    }
}
