package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentRes;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndConsignmentService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 수탁사정보 관리(관리자) (AS-IS Fnd03_Tab_ConsignmentManager → server/fnd/Fnd03_Consignment) — 메뉴 #1102 */
@RestController
@RequestMapping("/api/v1/fnd/consignments")
@RequiredArgsConstructor
public class FndConsignmentController {

    private final FndConsignmentService service;

    /** AS-IS fnd.Fnd03_Consignment.selectByCompanyId0 */
    @GetMapping
    public ApiResponse<List<ConsignmentRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(defaultValue = "") String searchText,
                                                    @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, searchText, useYn));
    }

    /** AS-IS fnd.Fnd03_Consignment.insertCheck → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<ConsignmentRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ConsignmentSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS fnd.Fnd03_Consignment.selectIcamConsignment: ICAM가져오기 — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/import")
    public ApiResponse<Void> importIcam(@AuthenticationPrincipal UserPrincipal principal) {
        service.importIcam(principal);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd03_Consignment.selectByText — P05 조회창. 로그인 회사의 것, 이름 검색 */
    @GetMapping("/lookup")
    public ApiResponse<List<ConsignmentRes>> lookup(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.lookup(principal, searchText));
    }
}
