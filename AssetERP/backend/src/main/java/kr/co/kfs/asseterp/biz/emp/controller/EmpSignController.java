package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpSignRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpSignSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpSignService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 결재서명관리 (AS-IS Emp60_Tab_Sign → server/emp/Emp60_Sign, G09) */
@RestController
@RequestMapping("/api/v1/emp/signs")
@RequiredArgsConstructor
public class EmpSignController {

    private final EmpSignService service;

    /** AS-IS emp.Emp60_Sign.selectByPersonId */
    @GetMapping
    public ApiResponse<List<EmpSignRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS emp.Emp60_Sign.update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<EmpSignRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<EmpSignSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp60_Sign.deleteChk → 결재선에서 쓴 서명이 있으면 true */
    @PostMapping("/used")
    public ApiResponse<Boolean> isUsed(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.isUsed(principal, ids));
    }

    /** AS-IS emp.Emp60_Sign.delete → 지운 건수. 사용 중이면 400 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
