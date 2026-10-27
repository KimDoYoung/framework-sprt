package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkCompanySaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndOfficeWorkService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 사무수탁사정보 관리(관리자 #1094 / 회사별 #1052) (AS-IS Fnd06_Tab_OfficeWorkManager / Fnd06_Tab_OfficeWork → server/fnd/Fnd06_OfficeWork) */
@RestController
@RequestMapping("/api/v1/fnd/office-works")
@RequiredArgsConstructor
public class FndOfficeWorkController {

    private final FndOfficeWorkService service;

    /** AS-IS fnd.Fnd06_OfficeWork.selectByCompanyId0 */
    @GetMapping
    public ApiResponse<List<OfficeWorkRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(defaultValue = "") String searchText,
                                                   @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, searchText, useYn));
    }

    /** AS-IS fnd.Fnd06_OfficeWork.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<OfficeWorkRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<OfficeWorkSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS fnd.Fnd06_OfficeWork.selectIcamOfficeWork: ICAM가져오기 — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/import")
    public ApiResponse<Void> importIcam(@AuthenticationPrincipal UserPrincipal principal) {
        service.importIcam(principal);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd06_OfficeWork.selectByText — P05 조회창. 로그인 회사의 것, 이름 검색 */
    @GetMapping("/lookup")
    public ApiResponse<List<OfficeWorkRes>> lookup(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.lookup(principal, searchText));
    }

    /** AS-IS fnd.Fnd06_OfficeWork.selectByCompanyId (R11 #1052 사무수탁사정보 관리) */
    @GetMapping("/company")
    public ApiResponse<List<OfficeWorkCompanyRes>> searchCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @RequestParam(defaultValue = "") String searchText,
                                                                 @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.searchCompany(principal, searchText, useYn));
    }

    /** AS-IS fnd.Fnd06_OfficeWork.preUpdate + update (R11 #1052) */
    @PutMapping("/company")
    public ApiResponse<List<OfficeWorkCompanyRes>> saveCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestBody List<OfficeWorkCompanySaveReq> rows) {
        return ApiResponse.ok(service.saveCompany(principal, rows));
    }

    /** AS-IS fnd.Fnd06_OfficeWork.delete (R11 #1052) */
    @DeleteMapping("/company")
    public ApiResponse<Void> deleteCompany(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestBody List<Long> officeWorkIds) {
        service.deleteCompany(principal, officeWorkIds);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd06_OfficeWork.selectIcamOfficeWork (R11 #1052) */
    @PostMapping("/company/import")
    public ApiResponse<Void> importCompanyIcam(@AuthenticationPrincipal UserPrincipal principal) {
        service.importCompanyIcam(principal);
        return ApiResponse.ok(null);
    }
}
