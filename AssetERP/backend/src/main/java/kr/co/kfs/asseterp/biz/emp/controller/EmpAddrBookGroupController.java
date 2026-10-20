package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpAddrBookGroupService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 주소록 그룹설정 (AS-IS Emp57_Lookup_Insert·Emp57_TabPage_Insert·Emp57_Edit_GroupName → server/emp/Emp57_AddrBookGroup, G11) */
@RestController
@RequestMapping("/api/v1/emp/addr-book-groups")
@RequiredArgsConstructor
public class EmpAddrBookGroupController {

    private final EmpAddrBookGroupService service;

    /** AS-IS emp.Emp57_AddrBookGroup.getPersonList */
    @GetMapping
    public ApiResponse<List<EmpAddrBookGroupRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS emp.Emp57_AddrBookGroup.modelUpdate (새 그룹) */
    @PostMapping
    public ApiResponse<EmpAddrBookGroupRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EmpAddrBookGroupSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS emp.Emp57_AddrBookGroup.modelUpdate (고친 그룹) */
    @PutMapping("/{addrBookGroupId}")
    public ApiResponse<EmpAddrBookGroupRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long addrBookGroupId,
                                                   @RequestBody EmpAddrBookGroupSaveReq req) {
        return ApiResponse.ok(service.update(principal, addrBookGroupId, req));
    }

    /** AS-IS emp.Emp57_AddrBookGroup.deleteAll — 그룹과 그 안의 담당자 전부, 지운 건수 */
    @DeleteMapping("/{addrBookGroupId}")
    public ApiResponse<Integer> deleteAll(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long addrBookGroupId) {
        return ApiResponse.ok(service.deleteAll(principal, addrBookGroupId));
    }

    /** AS-IS emp.Emp57_AddrBookGroup.selectByParentId */
    @GetMapping("/{parentId}/members")
    public ApiResponse<List<EmpAddrBookMemberRes>> searchMembers(@PathVariable Long parentId) {
        return ApiResponse.ok(service.searchMembers(parentId));
    }

    /** AS-IS emp.Emp57_AddrBookGroup.update → 저장된 행 */
    @PutMapping("/members")
    public ApiResponse<List<EmpAddrBookMemberRes>> saveMembers(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestBody List<EmpAddrBookMemberSaveReq> rows) {
        return ApiResponse.ok(service.saveMembers(principal, rows));
    }

    /** AS-IS emp.Emp57_AddrBookGroup.delete → 지운 건수 */
    @DeleteMapping("/members")
    public ApiResponse<Integer> deleteMembers(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteMembers(principal, ids));
    }
}
