package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltExceptPersonService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 예외사원 (AS-IS Flt16_Lookup_ExceptPerson → server/flt/Flt16_ExceptPerson) — 기준관리 화면의 조회창 */
@RestController
@RequestMapping("/api/v1/flt/except-persons")
@RequiredArgsConstructor
public class FltExceptPersonController {

    private final FltExceptPersonService service;

    /** AS-IS flt.Flt16_ExceptPerson.selectByCompanyId — 로그인 회사 */
    @GetMapping
    public ApiResponse<List<ExceptPersonRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS flt.Flt16_ExceptPerson.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<ExceptPersonRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ExceptPersonSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt16_ExceptPerson.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
