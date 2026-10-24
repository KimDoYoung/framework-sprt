package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlJobRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlJobSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlJobService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 매뉴얼 작업대상 선정(AS-IS Tdm40_Tab_ManlJob, N15) → server/tdm/Tdm40_ManlJob */
@RestController
@RequestMapping("/api/v1/tdm/manl-jobs")
@RequiredArgsConstructor
public class TdmManlJobController {

    private final TdmManlJobService service;

    /** AS-IS tdm.Tdm40_ManlJob.selectByText (writingYn = 작성중만 조회) */
    @GetMapping
    public ApiResponse<List<ManlJobRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) String searchText,
                                                @RequestParam(defaultValue = "false") boolean writingYn) {
        return ApiResponse.ok(service.search(principal, searchText, writingYn));
    }

    /** AS-IS tdm.Tdm40_ManlJob.update — manlJobId ≤ 0이면 등록 */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ManlJobSaveReq> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm40_ManlJob.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> manlJobIds) {
        return ApiResponse.ok(service.delete(principal, manlJobIds));
    }

    /** AS-IS tdm41Chk — tdm.Tdm41_ManlDuty.selectByManlJobId 에 행이 있는가 */
    @GetMapping("/{manlJobId}/has-duties")
    public ApiResponse<Boolean> hasDuties(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlJobId) {
        return ApiResponse.ok(service.hasDuties(principal, manlJobId));
    }

    /** AS-IS tdm.Tdm43_Manl.countByManlJobId */
    @GetMapping("/{manlJobId}/manl-count")
    public ApiResponse<Integer> manlCount(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlJobId) {
        return ApiResponse.ok(service.countManls(principal, manlJobId));
    }

    /** AS-IS tdm.Tdm40_ManlJob.deleteAll — 작성내역(관리의무·부서·점검항목)만 지우고 작업 행은 남긴다 */
    @DeleteMapping("/{manlJobId}/contents")
    public ApiResponse<Void> deleteAll(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlJobId) {
        service.deleteAll(principal, manlJobId);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm40_ManlJob.createDuty (관리의무생성) */
    @PostMapping("/{manlJobId}/duties")
    public ApiResponse<Void> createDuty(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlJobId) {
        service.createDuty(principal, manlJobId);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm40_ManlJob.createDirectManl — actionName: REDEFINE_BY_ROLE(매뉴얼 작성)·REMAKE_FROM_LATEST(매뉴얼 복제) */
    @PostMapping("/{manlJobId}/manuals")
    public ApiResponse<Void> createDirectManl(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlJobId,
                                              @RequestParam String actionName) {
        service.createDirectManl(principal, manlJobId, actionName);
        return ApiResponse.ok(null);
    }
}
