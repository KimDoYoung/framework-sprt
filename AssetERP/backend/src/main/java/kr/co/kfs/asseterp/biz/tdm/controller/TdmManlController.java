package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopyDutiesReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopyItemRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopyReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopySourceRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlFormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlEtcReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRefBasisReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelateLinkReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelatesRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlService;
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

/** 부서 책무매뉴얼의 점검항목 (AS-IS Tdm43_Lookup_ManlItem → server/tdm/Tdm43_Manl) */
@RestController
@RequestMapping("/api/v1/tdm/manls")
@RequiredArgsConstructor
public class TdmManlController {

    private final TdmManlService service;

    /** AS-IS tdm.Tdm43_Manl.selectByManlOrgId (useYn: % 전체 / true 사용 / false 미사용) */
    @GetMapping
    public ApiResponse<List<ManlItemRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam Long manlOrgId,
                                                 @RequestParam(defaultValue = "%") String useYn,
                                                 @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, manlOrgId, useYn, searchText));
    }

    /** 등록창을 열 때 받는 새 점검항목 번호 */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlOrgId) {
        return ApiResponse.ok(service.nextId(principal, manlOrgId));
    }

    /** 점검항목에 연결된 법규·내규·양식·문서분류 (등록 직후 번호는 빈 목록) */
    @GetMapping("/{manlId}/relates")
    public ApiResponse<ManlRelatesRes> relates(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlId, @RequestParam Long manlOrgId) {
        return ApiResponse.ok(service.relates(principal, manlOrgId, manlId));
    }

    /** AS-IS tdm.Tdm43_Manl.modelUpdate (등록·수정) */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** 연결 한 건 삭제 (kind: ics·icr·form·dcr) */
    @DeleteMapping("/{manlId}/relates/{kind}/{relateId}")
    public ApiResponse<Void> deleteRelate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlId, @PathVariable String kind,
                                          @PathVariable Long relateId, @RequestParam Long manlOrgId) {
        service.deleteRelate(principal, manlOrgId, manlId, kind, relateId);
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys10_File.selectUnConnTdmFormFile (Tdm43_Lookup_RelateFormFileList) */
    @GetMapping("/form-files")
    public ApiResponse<List<ManlFormFileRes>> formFiles(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(defaultValue = "%") String formType,
                                                        @RequestParam(required = false) String searchText,
                                                        @RequestParam(required = false) Long relateId) {
        return ApiResponse.ok(service.formFiles(principal, formType, searchText, relateId));
    }

    /** AS-IS tdm.Tdm43_Manl.delete (선택한 한 건) */
    @DeleteMapping("/{manlId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlId, @RequestParam Long manlOrgId) {
        service.delete(principal, manlOrgId, manlId);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm43_Manl.selectByManlDutyId — 매뉴얼(점검항목) 작성(N17) 아래 그리드 */
    @GetMapping("/by-duty")
    public ApiResponse<List<ManlItemRes>> searchByDuty(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlDutyId, @RequestParam Long orgId) {
        return ApiResponse.ok(service.searchByDuty(principal, manlDutyId, orgId));
    }

    /** AS-IS tdm.Tdm43_Manl.selectByRoleId — 점검항목 불러오기 조회창(TabPage) 위 그리드 */
    @GetMapping("/sources/by-role")
    public ApiResponse<List<ManlCopySourceRes>> sourcesByRole(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long roleId, @RequestParam(required = false) Long taskId,
                                                              @RequestParam(required = false) Long orgId, @RequestParam String stdDate,
                                                              @RequestParam(defaultValue = "false") boolean allYn,
                                                              @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.sourcesByRole(principal, roleId, taskId, orgId, stdDate, allYn, searchText));
    }

    /** AS-IS tdm.Tdm43_Manl.selectByManlJobId — 주요관리의무 불러오기 조회창(본 화면) 위 그리드 */
    @GetMapping("/sources/by-job")
    public ApiResponse<List<ManlCopySourceRes>> sourcesByJob(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlJobId,
                                                             @RequestParam Long stdRoleId, @RequestParam Long stdOrgId,
                                                             @RequestParam(required = false) Long roleId, @RequestParam(required = false) Long taskId,
                                                             @RequestParam(required = false) Long orgId, @RequestParam String stdDate,
                                                             @RequestParam(defaultValue = "false") boolean allYn,
                                                             @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.sourcesByJob(principal, manlJobId, stdRoleId, stdOrgId, roleId, taskId, orgId, stdDate, allYn, searchText));
    }

    /** AS-IS tdm.Tdm43_Manl.selectByTaskRelateDutyId — 조회창 아래 그리드 */
    @GetMapping("/sources/items")
    public ApiResponse<List<ManlCopyItemRes>> sourceItems(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlOrgId, @RequestParam Long taskRelateDutyId) {
        return ApiResponse.ok(service.sourceItems(principal, manlOrgId, taskRelateDutyId));
    }

    /** AS-IS tdm.Tdm43_Manl.copyManlList */
    @PostMapping("/copy")
    public ApiResponse<Void> copyManls(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlCopyReq req) {
        service.copyManls(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm43_Manl.copyDutyList */
    @PostMapping("/copy-duties")
    public ApiResponse<Void> copyDuties(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlCopyDutiesReq req) {
        service.copyDuties(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm43_Manl.delete (선택한 점검항목 여러 건) */
    @DeleteMapping
    public ApiResponse<Void> deleteAll(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long manlOrgId, @RequestParam List<Long> manlIds) {
        service.deleteAll(principal, manlOrgId, manlIds);
        return ApiResponse.ok(null);
    }

    // ── N27 책무관리현황 > 매뉴얼 규정/양식 연결 ──

    /** AS-IS tdm.Tdm43_Manl.selectByDate (stdDate 'yyyy-MM-dd') */
    @GetMapping("/by-date")
    public ApiResponse<List<ManlListRes>> searchByDate(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate,
                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchByDate(principal, stdDate, searchText));
    }

    /** AS-IS tdm.Tdm43_Manl.selectById */
    @GetMapping("/{manlId}/row")
    public ApiResponse<ManlListRes> row(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlId) {
        return ApiResponse.ok(service.getRow(principal, manlId));
    }

    /** 고른 점검항목들에 법규·내규·양식·문서분류 연결 → 바뀐 행들 */
    @PostMapping("/relate-links")
    public ApiResponse<List<ManlListRes>> linkRelates(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlRelateLinkReq req) {
        return ApiResponse.ok(service.linkRelates(principal, req));
    }

    /** AS-IS tdm.Tdm43_Manl.updateEtc */
    @PutMapping("/{manlId}/etc")
    public ApiResponse<ManlListRes> updateEtc(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlId, @RequestBody ManlEtcReq req) {
        return ApiResponse.ok(service.updateEtc(principal, manlId, req));
    }

    /** AS-IS tdm.Tdm43_Manl.updateRefBasis */
    @PutMapping("/{manlId}/ref-basis")
    public ApiResponse<Void> updateRefBasis(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlId, @RequestBody ManlRefBasisReq req) {
        service.updateRefBasis(principal, manlId, req.refBasis());
        return ApiResponse.ok(null);
    }
}
