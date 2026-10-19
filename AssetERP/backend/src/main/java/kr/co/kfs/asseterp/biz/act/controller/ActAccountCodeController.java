package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeAdminRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeCopyReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodePrintSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeTreeRes;
import kr.co.kfs.asseterp.biz.act.dto.ActCompanyRes;
import kr.co.kfs.asseterp.biz.act.service.ActAccountCodeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 계정코드 (AS-IS Act01_Tab_AccountCode(메뉴 #1114·#1250)·Act01_Lookup_AccountCode → server/act/Act01_AccountCode) */
@RestController
@RequestMapping("/api/v1/act/account-codes")
@RequiredArgsConstructor
public class ActAccountCodeController {

    private final ActAccountCodeService service;

    /** AS-IS act.Act01_AccountCode.selectBySlipYn (전표생성 계정, companyId 없으면 로그인 회사) */
    @GetMapping("/lookup")
    public ApiResponse<List<AccountCodeRes>> lookup(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long companyId,
                                                    @RequestParam(required = false) String attributeCode,
                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchBySlipYn(principal, companyId, attributeCode, searchText));
    }

    /** AS-IS act.Act01_AccountCode.selectByCompanyId (로그인 회사) */
    @GetMapping
    public ApiResponse<List<AccountCodeAdminRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) String searchText,
                                                         @RequestParam(required = false) String useYn,
                                                         @RequestParam(required = false) String attributeCode) {
        return ApiResponse.ok(service.search(principal, searchText, useYn, attributeCode));
    }

    /** AS-IS act.Act01_AccountCode.modelUpdate (편집창 저장 — accountCodeId 없으면 등록) */
    @PutMapping
    public ApiResponse<AccountCodeAdminRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AccountCodeSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS act.Act01_AccountCode.update (출력정보 및 사용여부 설정 저장) → 저장된 행 */
    @PutMapping("/print")
    public ApiResponse<List<AccountCodeAdminRes>> savePrint(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestBody List<AccountCodePrintSaveReq> rows) {
        return ApiResponse.ok(service.savePrint(principal, rows));
    }

    /** AS-IS act.Act01_AccountCode.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS act.Act01_AccountCode.selectTreeByCompanyId (계정과목복사 창의 기준 고객사 트리) */
    @GetMapping("/tree")
    public ApiResponse<List<AccountCodeTreeRes>> tree(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(service.tree(principal, companyId));
    }

    /** AS-IS sys.Sys01_Company.selectByUseYn (계정과목복사 창의 고객사 — 관리자만) */
    @GetMapping("/copy-companies")
    public ApiResponse<List<ActCompanyRes>> copyCompanies(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.companies(principal));
    }

    /** AS-IS act.Act01_AccountCode.insertAdminCopy (계정과목복사 — 관리자만) → 처리한 고객사 수 */
    @PostMapping("/copy-admin")
    public ApiResponse<Integer> copyAdmin(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AccountCodeCopyReq req) {
        return ApiResponse.ok(service.copyAdmin(principal, req));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdAccountCode + RD 리포트 → 조회 결과 xlsx) */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam(required = false) String searchText,
                                           @RequestParam(required = false) String useYn,
                                           @RequestParam(required = false) String attributeCode) {
        byte[] body = service.download(principal, searchText, useYn, attributeCode);
        String fileName = "계정과목(" + LocalDate.now() + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }
}
