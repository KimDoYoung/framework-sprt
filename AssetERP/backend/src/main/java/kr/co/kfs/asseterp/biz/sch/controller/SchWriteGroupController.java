package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch22WriteGroupRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch22WriteGroupSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchWriteGroupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 작성(담당)그룹 관리 (AS-IS Sch22_Lookup_WriteGroup·Sch02_Page_Share → server/sch/Sch22_WriteGroup·Sch02_Share) — 내부통제 체크리스트(K04)가 연다 */
@RestController
@RequestMapping("/api/v1/sch/write-groups")
@RequiredArgsConstructor
public class SchWriteGroupController {

    private final SchWriteGroupService service;

    /** AS-IS sch.Sch22_WriteGroup.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<Sch22WriteGroupRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS sch.Sch22_WriteGroup.update → 저장한 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch22WriteGroupRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch22WriteGroupSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS sch.Sch22_WriteGroup.checkByWriteGroupId → 사용 중이면 true */
    @GetMapping("/{writeGroupId}/in-use")
    public ApiResponse<Boolean> inUse(@PathVariable Long writeGroupId) {
        return ApiResponse.ok(service.inUse(writeGroupId));
    }

    /** AS-IS sch.Sch02_Share.deleteByInfoId + sch.Sch22_WriteGroup.delete → 지운 그룹 수 */
    @DeleteMapping("/{writeGroupId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long writeGroupId) {
        return ApiResponse.ok(service.delete(principal, writeGroupId));
    }

    /** AS-IS sch.Sch02_Share.selectByInfoId2 */
    @GetMapping("/{writeGroupId}/shares")
    public ApiResponse<List<Sch02ShareRes>> searchShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long writeGroupId) {
        return ApiResponse.ok(service.searchShares(principal, writeGroupId));
    }

    /** AS-IS sch.Sch02_Share.update → 저장한 행(요청 순서) */
    @PutMapping("/{writeGroupId}/shares")
    public ApiResponse<List<Sch02ShareRes>> saveShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long writeGroupId,
                                                       @RequestBody List<Sch02ShareSaveReq> rows) {
        return ApiResponse.ok(service.saveShares(principal, writeGroupId, rows));
    }

    /** AS-IS sch.Sch02_Share.checkWriteGroup — 작성내역이 있으면 오류 "작성내역이 존재하여 삭제할 수 없습니다" */
    @PostMapping("/shares/check-delete")
    public ApiResponse<Boolean> checkDeleteShares(@RequestBody List<Long> shareIds) {
        service.checkDeleteShares(shareIds);
        return ApiResponse.ok(true);
    }

    /** AS-IS sch.Sch02_Share.delete → 지운 수 */
    @DeleteMapping("/{writeGroupId}/shares")
    public ApiResponse<Integer> deleteShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long writeGroupId,
                                             @RequestBody List<Long> shareIds) {
        return ApiResponse.ok(service.deleteShares(principal, writeGroupId, shareIds));
    }
}
