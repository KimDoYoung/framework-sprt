package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckEndReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctIdsReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckJobRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckJobSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckLockReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgManagerRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckPreCreateRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRdPrintRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckOrgRes;
import kr.co.kfs.asseterp.biz.tdm.service.CheckExctPdfMaker.PdfOutcome;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckJobService;
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

/** 이행점검 작업 및 보고 (AS-IS Tdm50_Tab_CheckJob, N20) → server/tdm/Tdm50_ChckJob·Tdm53_ChckExct·Tdm51_ChckOrg·Tdm56_ChckRelateAppr */
@RestController
@RequestMapping("/api/v1/tdm/check-jobs")
@RequiredArgsConstructor
public class TdmCheckJobController {

    private final TdmCheckJobService service;

    /** AS-IS tdm.Tdm50_ChckJob.selectRcntChckJob — 진행 중인 점검년월(없으면 null) */
    @GetMapping("/recent")
    public ApiResponse<String> recent(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.recentCheckYm(principal));
    }

    /** AS-IS tdm.Tdm50_ChckJob.selectByCheckYm (defaultYn=true) */
    @GetMapping
    public ApiResponse<CheckJobRes> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String checkYm) {
        return ApiResponse.ok(service.search(principal, checkYm));
    }

    /** AS-IS tdm.Tdm20_Role.getCeoRoleList */
    @GetMapping("/ceo-roles")
    public ApiResponse<List<CheckRoleRes>> ceoRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam String checkYm, @RequestParam String baseDate) {
        return ApiResponse.ok(service.ceoRoles(principal, checkYm, baseDate));
    }

    /** AS-IS tdm.Tdm50_ChckJob.modelUpdate — 작업정보등록 */
    @PutMapping
    public ApiResponse<CheckJobRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckJobSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS tdm.Tdm50_ChckJob.preCreateCheckManl */
    @PostMapping("/{chckJobId}/pre-create")
    public ApiResponse<CheckPreCreateRes> preCreate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckJobId) {
        return ApiResponse.ok(service.preCreate(principal, chckJobId));
    }

    /** AS-IS tdm.Tdm50_ChckJob.createCheckManl */
    @PostMapping("/{chckJobId}/items")
    public ApiResponse<Void> createItems(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckJobId) {
        service.createCheckManl(principal, chckJobId);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm50_ChckJob.deleteChckManl */
    @DeleteMapping("/{chckJobId}/items")
    public ApiResponse<Void> deleteItems(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckJobId) {
        service.deleteChckManl(principal, chckJobId);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm50_ChckJob.updateEndYn — 점검마감·마감취소 */
    @PutMapping("/{chckJobId}/end")
    public ApiResponse<Void> end(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckJobId, @RequestBody CheckEndReq req) {
        service.updateEndYn(principal, chckJobId, Boolean.TRUE.equals(req.endYn()));
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm51_ChckOrg.getMessageList — 알림발송 대상 */
    @GetMapping("/{chckJobId}/message-targets")
    public ApiResponse<List<CheckOrgManagerRes>> messageTargets(@AuthenticationPrincipal UserPrincipal principal,
                                                                @PathVariable Long chckJobId, @RequestParam String baseDate) {
        return ApiResponse.ok(service.messageTargets(principal, chckJobId, baseDate));
    }

    /** AS-IS tdm.Tdm53_ChckExct.selectByChckJobId */
    @GetMapping("/{chckJobId}/excts")
    public ApiResponse<List<CheckExctRes>> excts(@AuthenticationPrincipal UserPrincipal principal,
                                                 @PathVariable Long chckJobId, @RequestParam Long ceoRoleId) {
        return ApiResponse.ok(service.excts(principal, chckJobId, ceoRoleId));
    }

    /** AS-IS tdm.Tdm51_ChckOrg.selectByRoleId */
    @GetMapping("/{chckJobId}/orgs")
    public ApiResponse<List<ChckOrgRes>> orgs(@AuthenticationPrincipal UserPrincipal principal,
                                              @PathVariable Long chckJobId, @RequestParam Long roleId) {
        return ApiResponse.ok(service.orgs(principal, chckJobId, roleId));
    }

    /** AS-IS tdm.Tdm56_ChckRelateAppr.selectApprStatus — 없으면 data null */
    @GetMapping("/{chckJobId}/appr-status")
    public ApiResponse<CheckApprRes> apprStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                @PathVariable Long chckJobId, @RequestParam Long ceoRoleId) {
        return ApiResponse.ok(service.apprStatus(principal, chckJobId, ceoRoleId));
    }

    /** AS-IS tdm.Tdm56_ChckRelateAppr.selectByCeoRoleId */
    @GetMapping("/{chckJobId}/apprs")
    public ApiResponse<List<CheckApprRes>> apprs(@AuthenticationPrincipal UserPrincipal principal,
                                                 @PathVariable Long chckJobId, @RequestParam Long ceoRoleId) {
        return ApiResponse.ok(service.apprs(principal, chckJobId, ceoRoleId));
    }

    /** AS-IS tdm.Tdm53_ChckExct.updateLockYn */
    @PutMapping("/excts/lock")
    public ApiResponse<Void> updateLock(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckLockReq req) {
        service.updateLock(principal, Boolean.TRUE.equals(req.isLock()), req.chckExctIds());
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm53_ChckExct.deleteList — 잠금해제 때 보고서 파일 행 삭제 */
    @DeleteMapping("/excts/files")
    public ApiResponse<Void> deleteFiles(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckExctIdsReq req) {
        service.deleteFiles(principal, req.chckExctIds());
        return ApiResponse.ok(null);
    }

    /** 한 건 PDF 생성 — 여러 건의 진행 표시는 화면이 건마다 부른다. 결과 OK / RD_FAILED(잠금 되돌림) / FILE_FAILED(멈춤) */
    @PostMapping("/excts/{chckExctId}/recreate")
    public ApiResponse<PdfOutcome> recreate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckExctId) {
        return ApiResponse.ok(service.recreate(principal, chckExctId));
    }

    /** AS-IS Sys99_Print.CreateTdmCheckJob (viewRd) — RD 뷰어용 출력 자료 */
    @PostMapping("/excts/{chckExctId}/rd-print")
    public ApiResponse<CheckRdPrintRes> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckExctId) {
        return ApiResponse.ok(service.rdPrint(principal, chckExctId));
    }
}
