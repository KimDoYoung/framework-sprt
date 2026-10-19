package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.ActCodeOptionRes;
import kr.co.kfs.asseterp.biz.act.dto.ActLinkCreateReq;
import kr.co.kfs.asseterp.biz.act.dto.ActLinkRes;
import kr.co.kfs.asseterp.biz.act.service.ActLinkService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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

/** 이익제공(수령) 계정코드 연결 (AS-IS Act01_Edit_AccountCode의 linkGrid → server/act/Act14_Link) */
@RestController
@RequestMapping("/api/v1/act/links")
@RequiredArgsConstructor
public class ActLinkController {

    private final ActLinkService service;

    /** AS-IS act.Act14_Link.selectByAccountCode (로그인 회사) */
    @GetMapping
    public ApiResponse<List<ActLinkRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String accountCode) {
        return ApiResponse.ok(service.search(principal, accountCode));
    }

    /** AS-IS act.Act14_Link.insert → 추가한 행 */
    @PostMapping
    public ApiResponse<ActLinkRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ActLinkCreateReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS act.Act14_Link.updateList (▲▼ 순서 변경 — 보이는 순서대로 id 목록) */
    @PutMapping("/order")
    public ApiResponse<Integer> order(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.order(principal, ids));
    }

    /** AS-IS act.Act14_Link.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%) — 편집창의 내용 콤보 */
    @GetMapping("/provide-contents")
    public ApiResponse<List<ActCodeOptionRes>> provideContents(@RequestParam String purposeCode) {
        return ApiResponse.ok(service.provideContents(purposeCode));
    }
}
