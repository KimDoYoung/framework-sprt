package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypePushReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeUpdateReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrDocTypeService;
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

/** 문서양식 (AS-IS Dcr05_Lookup_DocType·Dcr05_Edit_Update → server/dcr/Dcr05_DocType) */
@RestController
@RequestMapping("/api/v1/dcr/doc-types")
@RequiredArgsConstructor
public class DcrDocTypeController {

    private final DcrDocTypeService service;

    /** AS-IS dcr.Dcr05_DocType.selectByName */
    @GetMapping
    public ApiResponse<List<DcrDocTypeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) String searchText,
                                                   @RequestParam(required = false) String formClassCode,
                                                   @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(service.search(principal, searchText, formClassCode, companyId));
    }

    /** AS-IS dcr.Dcr05_DocType.updateEdit → 저장된 행 */
    @PutMapping("/{docTypeId}")
    public ApiResponse<DcrDocTypeRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long docTypeId,
                                             @RequestBody DcrDocTypeUpdateReq req, @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(service.update(principal, docTypeId, req, companyId));
    }

    /** AS-IS dcr.Dcr05_DocType.update (Dcr05_Edit_DocType 문서양식 등록) → 저장된 행 */
    @PostMapping
    public ApiResponse<DcrDocTypeRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrDocTypeUpdateReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS dcr.Dcr05_DocType.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long companyId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, companyId, ids));
    }

    /** AS-IS dcr.Dcr05_DocType.pushData → 복사한 건수 */
    @PostMapping("/push")
    public ApiResponse<Integer> pushData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrDocTypePushReq req) {
        return ApiResponse.ok(service.pushData(principal, req));
    }

    /** AS-IS dcr.Dcr05_DocType.checkDocFormClassCode — 쓰는 양식이 있으면 오류 문구로 거절 */
    @GetMapping("/check-form-class")
    public ApiResponse<Void> checkDocFormClassCode(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String docFormClassCode) {
        service.checkDocFormClassCode(principal, docFormClassCode);
        return ApiResponse.ok(null);
    }
}
