package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerInfoRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManagerService;
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

/** 책무담당자 등록 (AS-IS server/tdm/Tdm08_ManagerInfo) */
@RestController
@RequestMapping("/api/v1/tdm/managers")
@RequiredArgsConstructor
public class TdmManagerController {

    private final TdmManagerService service;

    /** AS-IS tdm.Tdm08_ManagerInfo.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<ManagerRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS tdm.Tdm08_ManagerInfo.selectByManagerType */
    @GetMapping("/infos")
    public ApiResponse<List<ManagerInfoRes>> searchInfos(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String managerType,
                                                         @RequestParam(required = false) Long orgId) {
        return ApiResponse.ok(service.searchInfos(principal, managerType, orgId));
    }

    /** AS-IS tdm.Tdm08_ManagerInfo.update */
    @PutMapping
    public ApiResponse<List<ManagerInfoRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ManagerSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS tdm.Tdm08_ManagerInfo.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> managerInfoIds) {
        return ApiResponse.ok(service.delete(principal, managerInfoIds));
    }
}
