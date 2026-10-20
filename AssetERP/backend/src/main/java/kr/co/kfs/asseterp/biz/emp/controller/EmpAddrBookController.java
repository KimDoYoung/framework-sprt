package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpAddrBookService;
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

/** 주소록 (AS-IS Emp10_Tab_AddrBook·Emp10_Tab_PublicAddrBook → server/emp/Emp10_AddrBook, G11·G12) */
@RestController
@RequestMapping("/api/v1/emp/addr-books")
@RequiredArgsConstructor
public class EmpAddrBookController {

    private final EmpAddrBookService service;

    /** AS-IS emp.Emp10_AddrBook.selectByText — 내 개인 주소록 */
    @GetMapping
    public ApiResponse<List<EmpAddrBookRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS emp.Emp10_AddrBook.selectByPublicText — 로그인 회사의 공용 주소록 */
    @GetMapping("/public")
    public ApiResponse<List<EmpAddrBookRes>> searchPublic(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchPublic(principal, searchText));
    }

    /** AS-IS emp.Emp10_AddrBook.update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<EmpAddrBookRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<EmpAddrBookSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp10_AddrBook.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
