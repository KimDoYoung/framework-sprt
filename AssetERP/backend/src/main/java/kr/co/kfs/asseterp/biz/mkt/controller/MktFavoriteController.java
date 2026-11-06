package kr.co.kfs.asseterp.biz.mkt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktFavoriteAddReq;
import kr.co.kfs.asseterp.biz.mkt.service.MktFavoriteService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Z05 업무활동처 즐겨찾기 (AS-IS server/mkt/Mkt06_Favorite). 목록은 GET mkt/target-companies/favorites */
@RestController
@RequestMapping("/api/v1/mkt/favorites")
@RequiredArgsConstructor
public class MktFavoriteController {

    private final MktFavoriteService service;

    /** AS-IS mkt.Mkt06_Favorite.modelUpdate → 등록 건수 */
    @PostMapping
    public ApiResponse<Integer> add(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<MktFavoriteAddReq> items) {
        return ApiResponse.ok(service.add(principal, items));
    }

    /** AS-IS mkt.Mkt06_Favorite.deleteList → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> favoriteIds) {
        return ApiResponse.ok(service.delete(principal, favoriteIds));
    }
}
