package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseReq;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.AccountStatusRes;
import kr.co.kfs.asseterp.biz.flt.dto.DocClassRes;
import kr.co.kfs.asseterp.biz.flt.service.FltAccountService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 임직원매매 계좌신고 (AS-IS Flt03_Tab_AccountReport, Flt06_TabPage_AccountClose → server/flt/Flt03_Account, Flt06_AccountClose) */
@RestController
@RequestMapping("/api/v1/flt/accounts")
@RequiredArgsConstructor
public class FltAccountController {

    private final FltAccountService service;

    /** AS-IS flt.Flt03_Account.selectByPersonId (로그인 사용자 본인) */
    @GetMapping
    public ApiResponse<List<AccountRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS flt.Flt03_Account.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<AccountRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AccountSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt03_Account.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS flt.Flt03_Account.getItemTypeName (종목유형 6자리 "101000" → 이름) */
    @GetMapping("/item-type-name")
    public ApiResponse<String> itemTypeName(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String itemType) {
        return ApiResponse.ok(service.itemTypeName(principal, itemType));
    }

    /** AS-IS flt.Flt02_Emp.selectByDate + flt.Flt04_Oath.selectByDate (화면 위 보고주기·서약서 안내) */
    @GetMapping("/status")
    public ApiResponse<AccountStatusRes> status(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.status(principal));
    }

    /** AS-IS dcr.Dcr30_Link.selectByLinkCode (B05 계좌신고, B06 계좌폐쇄) → 기본 문서분류, 없으면 null */
    @GetMapping("/doc-class")
    public ApiResponse<DocClassRes> docClass(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String linkCode) {
        return ApiResponse.ok(service.docClass(principal, linkCode));
    }

    /** AS-IS flt.Flt06_AccountClose.selectByPersonId */
    @GetMapping("/closes")
    public ApiResponse<List<AccountCloseRes>> searchCloses(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchCloses(principal));
    }

    /** AS-IS flt.Flt06_AccountClose.insert (계좌폐쇄) → 등록한 건수 */
    @PostMapping("/closes")
    public ApiResponse<Integer> createCloses(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AccountCloseReq req) {
        return ApiResponse.ok(service.createCloses(principal, req));
    }

    /** AS-IS flt.Flt06_AccountClose.delete (폐쇄취소) → 지운 건수 */
    @DeleteMapping("/closes")
    public ApiResponse<Integer> deleteCloses(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteCloses(principal, ids));
    }
}
