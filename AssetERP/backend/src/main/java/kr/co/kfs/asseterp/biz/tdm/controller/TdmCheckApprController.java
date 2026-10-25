package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprBatchReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprCmntReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprCmntSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprEndInfoRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprManlRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprNeighborRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStartReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStatusReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprSubmitReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckApprRecordRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무이행점검 승인 (AS-IS Tdm59_Tab_CheckAppr, N23) → server/tdm/Tdm59_ChckApprCmnt·Tdm60_ChckManlAppr·Tdm61_ChckInsuffAppr */
@RestController
@RequestMapping("/api/v1/tdm/check-apprs")
@RequiredArgsConstructor
public class TdmCheckApprController {

    private final TdmCheckApprService service;

    /** AS-IS tdm.Tdm50_ChckJob.selectEndInfoByApprEmpId — 점검 작업이 없으면 null */
    @GetMapping("/end-info")
    public ApiResponse<CheckApprEndInfoRes> endInfo(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String checkYm) {
        return ApiResponse.ok(service.searchEndInfo(principal, checkYm));
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.selectByApprEmpId */
    @GetMapping
    public ApiResponse<List<CheckApprListRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam String checkYm, @RequestParam Long roleId) {
        return ApiResponse.ok(service.search(principal, checkYm, roleId));
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.checkTdmSubmitPossibleYn — 불가면 400 + 사유 */
    @GetMapping("/submit-possible")
    public ApiResponse<Void> submitPossible(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String checkYm,
                                            @RequestParam Long roleId, @RequestParam String actionType) {
        service.checkSubmitPossible(principal, checkYm, roleId, actionType);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.updateSubmit — 제출(P)·제출취소(C) */
    @PostMapping("/submit")
    public ApiResponse<Void> submit(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckApprSubmitReq req) {
        service.submit(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.selectPreNextOrg — targetType pre(하위부서)·next(상위부서) */
    @GetMapping("/{chckApprCmntId}/neighbor")
    public ApiResponse<CheckApprNeighborRes> neighbor(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                                      @RequestParam String targetType) {
        return ApiResponse.ok(service.searchNeighbor(principal, chckApprCmntId, targetType));
    }

    /** AS-IS tdm.Tdm52_ChckManl.countByChckApprCmntId(statusType 2) — 반려된 점검항목 수 */
    @GetMapping("/{chckApprCmntId}/count-reject")
    public ApiResponse<Integer> countReject(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId) {
        return ApiResponse.ok(service.countRejectedManls(principal, chckApprCmntId));
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.updateApprCmnt — actionType A(승인/등록)·R(반려)·C(취소)·U(저장). 응답 = 다시 읽은 승인 행 */
    @PutMapping("/{chckApprCmntId}/cmnt")
    public ApiResponse<CheckApprListRes> updateCmnt(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                                    @RequestBody CheckApprCmntReq req) {
        return ApiResponse.ok(service.updateCmnt(principal, chckApprCmntId, req));
    }

    /** AS-IS tdm.Tdm52_ChckManl.selectByChckApprCmntId */
    @GetMapping("/{chckApprCmntId}/manls")
    public ApiResponse<List<CheckApprManlRes>> manls(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                                     @RequestParam(defaultValue = "false") boolean undoneYn,
                                                     @RequestParam(required = false) String searchText,
                                                     @RequestParam(required = false) Long chckManlId) {
        return ApiResponse.ok(service.searchManls(principal, chckApprCmntId, undoneYn, searchText, chckManlId));
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByChckApprCmntId */
    @GetMapping("/{chckApprCmntId}/insuffs")
    public ApiResponse<List<CheckApprInsuffRes>> insuffs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                                         @RequestParam(defaultValue = "false") boolean undoneYn,
                                                         @RequestParam(required = false) Long chckInsuffId) {
        return ApiResponse.ok(service.searchInsuffs(principal, chckApprCmntId, undoneYn, chckInsuffId));
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateApprStart — 승인시작(P)·승인시작취소(C) */
    @PutMapping("/{chckApprCmntId}/appr-start")
    public ApiResponse<Void> apprStart(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                       @RequestBody CheckApprStartReq req) {
        service.apprStart(principal, chckApprCmntId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm60_ChckManlAppr.updateApprStatus2 — 일괄승인(P)·일괄승인취소(C) */
    @PutMapping("/{chckApprCmntId}/batch-appr")
    public ApiResponse<Void> batchAppr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                       @RequestBody CheckApprBatchReq req) {
        service.batchAppr(principal, chckApprCmntId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm60_ChckManlAppr.updateApprStatus — 승인(A)·반려(R)·취소(C). 응답 = 다시 읽은 점검항목 */
    @PutMapping("/{chckApprCmntId}/manls/{chckManlApprId}/status")
    public ApiResponse<CheckApprManlRes> updateManlStatus(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                                          @PathVariable Long chckManlApprId, @RequestBody CheckApprStatusReq req) {
        return ApiResponse.ok(service.updateManlStatus(principal, chckApprCmntId, chckManlApprId, req));
    }

    /** AS-IS tdm.Tdm60_ChckManlAppr.updateApprCmnt — 승인(반려)의견 임시저장 */
    @PutMapping("/{chckApprCmntId}/manls/{chckManlApprId}/cmnt")
    public ApiResponse<Void> saveManlCmnt(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                          @PathVariable Long chckManlApprId, @RequestBody CheckApprCmntSaveReq req) {
        service.saveManlCmnt(principal, chckApprCmntId, chckManlApprId, req.apprCmnt());
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm61_ChckInsuffAppr.updateApprStatus — 승인(A)·반려(R)·취소(C). 응답 = 다시 읽은 조치내역 */
    @PutMapping("/{chckApprCmntId}/insuffs/{chckInsuffApprId}/status")
    public ApiResponse<CheckApprInsuffRes> updateInsuffStatus(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                                              @PathVariable Long chckInsuffApprId, @RequestBody CheckApprStatusReq req) {
        return ApiResponse.ok(service.updateInsuffStatus(principal, chckApprCmntId, chckInsuffApprId, req));
    }

    /** AS-IS tdm.Tdm61_ChckInsuffAppr.updateApprCmnt — 승인(반려)의견 임시저장 */
    @PutMapping("/{chckApprCmntId}/insuffs/{chckInsuffApprId}/cmnt")
    public ApiResponse<Void> saveInsuffCmnt(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                            @PathVariable Long chckInsuffApprId, @RequestBody CheckApprCmntSaveReq req) {
        service.saveInsuffCmnt(principal, chckApprCmntId, chckInsuffApprId, req.apprCmnt());
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm55_ChckRecord.selectByChckApprCmntId — orgId를 주면 그 부서와 하위 */
    @GetMapping("/{chckApprCmntId}/records")
    public ApiResponse<List<ChckApprRecordRes>> records(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckApprCmntId,
                                                        @RequestParam(required = false) Long orgId) {
        return ApiResponse.ok(service.searchRecords(principal, chckApprCmntId, orgId));
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.selectById — 미흡내역 조치결과 승인 창의 보기 */
    @GetMapping("/insuff-detail/{chckInsuffId}")
    public ApiResponse<CheckApprInsuffRes> insuffDetail(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckInsuffId) {
        return ApiResponse.ok(service.getInsuff(principal, chckInsuffId));
    }

    /** AS-IS tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId */
    @GetMapping("/insuff-detail/{chckInsuffId}/records")
    public ApiResponse<List<CheckApprInsuffRecordRes>> insuffRecords(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @PathVariable Long chckInsuffId) {
        return ApiResponse.ok(service.searchInsuffRecords(principal, chckInsuffId));
    }
}
