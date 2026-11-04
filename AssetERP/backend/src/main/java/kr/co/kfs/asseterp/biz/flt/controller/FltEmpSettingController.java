package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.EmpOathApprReq;
import kr.co.kfs.asseterp.biz.flt.dto.EmpOathRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpSettingRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpSettingSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltEmpSettingService;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 임직원매매 기본설정 — 법규준수서약서·투자한도·보고주기·가족동의서 (AS-IS Flt02_Lookup_Emp → server/flt/Flt02_Emp·Flt04_Oath·Flt07_FamilyConsent). 로그인 사원 본인 것 */
@RestController
@RequestMapping("/api/v1/flt/emp-settings")
@RequiredArgsConstructor
public class FltEmpSettingController {

    private final FltEmpSettingService service;

    /** AS-IS flt.Flt02_Emp.selectByPersonId */
    @GetMapping
    public ApiResponse<List<EmpSettingRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS flt.Flt02_Emp.update → 저장된 행(요청과 같은 순서) */
    @PutMapping
    public ApiResponse<List<EmpSettingRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<EmpSettingSaveReq> list) {
        return ApiResponse.ok(service.save(principal, list));
    }

    /** AS-IS flt.Flt02_Emp.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS flt.Flt04_Oath.selectByPersonId — 서약서가 없으면 data null */
    @GetMapping("/oath")
    public ApiResponse<EmpOathRes> oath(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.oath(principal));
    }

    /** AS-IS flt.Flt04_Oath.updateApprId — 법규준수서약서(A06) 상신 ID 기록 */
    @PutMapping("/oath/appr-id")
    public ApiResponse<Integer> updateOathApprId(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EmpOathApprReq req) {
        return ApiResponse.ok(service.updateOathApprId(principal, req.apprId()));
    }

    /** AS-IS FileUpload?mode=flt07 (폼 항목 file) → 올린 파일 */
    @PostMapping(value = "/family-consents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileRes> uploadFamilyConsent(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("file") MultipartFile file) {
        return ApiResponse.ok("파일을 성공적으로 등록하였습니다.", service.uploadFamilyConsent(principal, file));
    }

    /** AS-IS flt.Flt07_FamilyConsent.deleteByFamilyConsentId → 지운 건수 (파일 정리는 이어서 sys/files/{id}/check-delete) */
    @DeleteMapping("/family-consents/{consentId}")
    public ApiResponse<Integer> deleteFamilyConsent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long consentId) {
        return ApiResponse.ok(service.deleteFamilyConsent(principal, consentId));
    }
}
