package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelateIcsAddReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelateIcsRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlRelateIcsService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법규에 연결된 책무이행점검항목 (AS-IS Ics01_Lookup_RelateTdm·Ics01_Lookup_SelectTdm → server/tdm/Tdm45_ManlRelateIcs·Tdm43_Manl) */
@RestController
@RequestMapping("/api/v1/tdm/manl-relate-ics")
@RequiredArgsConstructor
public class TdmManlRelateIcsController {

    private final TdmManlRelateIcsService service;

    /** AS-IS tdm.Tdm45_ManlRelateIcs.selectByIcsId */
    @GetMapping
    public ApiResponse<List<ManlRelateIcsRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long icsId,
                                                      @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByIcsId(principal, icsId, searchText));
    }

    /** AS-IS tdm.Tdm43_Manl.selectByExceptIcsId: 연결할 점검항목 후보 */
    @GetMapping("/candidates")
    public ApiResponse<List<ManlRes>> searchCandidates(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long icsId,
                                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchExceptIcsId(principal, icsId, searchText));
    }

    /** AS-IS tdm.Tdm45_ManlRelateIcs.insertList → 새로 연결한 건수 */
    @PostMapping
    public ApiResponse<Integer> insertList(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlRelateIcsAddReq req) {
        return ApiResponse.ok(service.insertList(principal, req.icsId(), req.manlIds()));
    }

    /** AS-IS tdm.Tdm45_ManlRelateIcs.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long icsId,
                                       @RequestBody List<Long> manlRelateIcsIds) {
        return ApiResponse.ok(service.delete(principal, icsId, manlRelateIcsIds));
    }
}
