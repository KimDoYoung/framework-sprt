package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndOfficeWorkService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 사무수탁사정보 관리(관리자) (AS-IS Fnd06_Tab_OfficeWorkManager → server/fnd/Fnd06_OfficeWork) — 메뉴 #1094 */
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
}
