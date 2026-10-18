package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlFormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelatesRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
}
