package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthClassRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthTargetRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrEmpAuthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 조회권한 예외사원 등록 (EE08 Dcr04_Tab_EmpAuth → dcr04_emp_auth) */
@RestController
@RequestMapping("/api/v1/dcr/emp-auths")
@RequiredArgsConstructor
public class DcrEmpAuthController {

    private final DcrEmpAuthService service;

    /** AS-IS dcr.Dcr04_EmpAuth.selectByText */
    @GetMapping
    public ApiResponse<List<DcrEmpAuthRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                                   @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, classTreeId, searchText));
    }

    /** AS-IS dcr.Dcr04_EmpAuth.getTargetList */
    @GetMapping("/targets")
    public ApiResponse<List<DcrEmpAuthTargetRes>> searchTargets(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchTargets(principal, searchText));
    }

    /** AS-IS dcr.Dcr04_EmpAuth.getTargetClassTreeList */
    @GetMapping("/by-person")
    public ApiResponse<List<DcrEmpAuthClassRes>> searchByPerson(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId,
                                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchTargetClassTrees(principal, personId, searchText));
    }

    /** AS-IS dcr.Dcr04_EmpAuth.updateList → 처리한 행 수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrEmpAuthSaveReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }

    /** AS-IS dcr.Dcr04_EmpAuth.delete → 지운 행 수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
