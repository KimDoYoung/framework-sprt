package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeService;
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

/** 공통코드 콤보 (AS-IS ComboBoxField → sys.Sys09_Code.selectByCodeKind) + 코드 관리 저장·삭제(Sys09_Grid_Code) */
@RestController
@RequestMapping("/api/v1/sys/codes")
@RequiredArgsConstructor
public class SysCodeController {

    private final SysCodeService sysCodeService;

    @GetMapping
    public ApiResponse<List<CodeRes>> searchCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String kindCd) {
        return ApiResponse.ok(sysCodeService.searchCodes(principal, kindCd));
    }

    /** AS-IS sys.Sys09_Code.update → 저장된 행(요청 순서). 회사는 행의 companyId(sys admin만 로그인 회사와 다르게) */
    @PutMapping
    public ApiResponse<List<CodeAdminRes>> updateCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestBody List<CodeAdminSaveReq> rows) {
        return ApiResponse.ok(sysCodeService.updateCodes(principal, rows));
    }

    /** AS-IS sys.Sys09_Code.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteCodes(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestParam(required = false) Long companyId,
                                            @RequestBody List<Long> codeIds) {
        return ApiResponse.ok(sysCodeService.deleteCodes(principal, companyId, codeIds));
    }
}
