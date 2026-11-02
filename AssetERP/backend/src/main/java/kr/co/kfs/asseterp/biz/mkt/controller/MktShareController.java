package kr.co.kfs.asseterp.biz.mkt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktShareRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktShareSaveReq;
import kr.co.kfs.asseterp.biz.mkt.service.MktShareService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Z05 공유지정 (AS-IS Mkt05_Lookup_Share → server/mkt/Mkt05_Share) — parentId는 활동처 ID 또는 활동내역 ID */
@RestController
@RequestMapping("/api/v1/mkt/shares")
@RequiredArgsConstructor
public class MktShareController {

    private final MktShareService service;

    /** AS-IS mkt.Mkt05_Share.selectByParentId */
    @GetMapping
    public ApiResponse<List<MktShareRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long parentId) {
        return ApiResponse.ok(service.search(principal, parentId));
    }

    /** AS-IS mkt.Mkt05_Share.selectShareInfo → 공유 요약(없으면 null) */
    @GetMapping("/info")
    public ApiResponse<String> info(@RequestParam Long parentId) {
        return ApiResponse.ok(service.shareInfo(parentId));
    }

    /** AS-IS mkt.Mkt05_Share.delete + update → 공유 요약 */
    @PutMapping
    public ApiResponse<String> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MktShareSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS mkt.Mkt05_Share.insertDefaultShare → 공유 요약(복사된 것이 없으면 null) */
    @PostMapping("/default")
    public ApiResponse<String> insertDefault(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long targetCompanyId,
                                             @RequestParam Long historyId) {
        return ApiResponse.ok(service.insertDefault(principal, targetCompanyId, historyId));
    }

    /** AS-IS mkt.Mkt05_Share.deleteDefaultShare */
    @DeleteMapping("/default")
    public ApiResponse<Void> deleteDefault(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long historyId) {
        service.deleteDefault(principal, historyId);
        return ApiResponse.ok(null);
    }
}
