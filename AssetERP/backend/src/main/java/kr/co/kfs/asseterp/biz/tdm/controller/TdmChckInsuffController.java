package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRecordSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffResultReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckInsuffService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 미흡/개선 내역(조치계획) — 조치계획 등록 (AS-IS Tdm54_Edit_ChckInsuff, N22) → server/tdm/Tdm54_ChckInsuff */
@RestController
@RequestMapping("/api/v1/tdm/chck-insuffs")
@RequiredArgsConstructor
public class TdmChckInsuffController {

    private final TdmChckInsuffService service;

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByChckManlId — 없으면 data가 null */
    @GetMapping("/by-manl")
    public ApiResponse<ChckInsuffRes> searchByManl(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long chckManlId) {
        return ApiResponse.ok(service.searchByManl(principal, chckManlId));
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.modelUpdate */
    @PutMapping
    public ApiResponse<ChckInsuffRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChckInsuffSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByRegDate (N24) */
    @GetMapping
    public ApiResponse<List<ChckInsuffListRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String startDate,
                                                       @RequestParam String endDate, @RequestParam(defaultValue = "true") boolean unDoneYn,
                                                       @RequestParam(required = false) Long roleId, @RequestParam(required = false) Long orgId,
                                                       @RequestParam(required = false) String statusCode) {
        return ApiResponse.ok(service.search(principal, startDate, endDate, unDoneYn, roleId, orgId, statusCode));
    }

    /** AS-IS tdm.Tdm51_ChckOrg.getTdmOrgId (N24) — 없으면 data가 null */
    @GetMapping("/tdm-org-id")
    public ApiResponse<Long> getTdmOrgId(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getTdmOrgId(principal));
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.updateComplete (N24) — procType U 저장·P 조치완료·C 완료취소 */
    @PutMapping("/{chckInsuffId}/result")
    public ApiResponse<ChckInsuffListRes> updateResult(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckInsuffId,
                                                       @RequestBody ChckInsuffResultReq req) {
        return ApiResponse.ok(service.updateResult(principal, chckInsuffId, req));
    }

    /** AS-IS tdm.Tdm63_ChckInsuffRecord.delete + update (N24 recordUpdate) — 조치기록 읽기는 GET check-apprs/insuff-detail/{id}/records */
    @PutMapping("/{chckInsuffId}/records")
    public ApiResponse<List<CheckApprInsuffRecordRes>> saveRecords(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckInsuffId,
                                                                   @RequestBody ChckInsuffRecordSaveReq req) {
        return ApiResponse.ok(service.saveRecords(principal, chckInsuffId, req));
    }
}
