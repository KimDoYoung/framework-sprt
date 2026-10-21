package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.EmpInfoRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpInfoSettingRes;
import kr.co.kfs.asseterp.biz.flt.service.FltEmpService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 임직원매매현황 (AS-IS Flt02_Tab_EmpInfo → server/flt/Flt02_Emp) — 준감인 */
@RestController
@RequestMapping("/api/v1/flt/emps")
@RequiredArgsConstructor
public class FltEmpController {

    private final FltEmpService service;

    /** AS-IS flt.Flt02_Emp.selectByCompanyId (J07) — 기준일 시점 재직 사원별 현황 */
    @GetMapping("/info")
    public ApiResponse<List<EmpInfoRes>> searchInfos(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam String stdDate,
                                                     @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchInfos(principal, stdDate, searchText));
    }

    /** AS-IS flt.Flt01_CompanyStd.selectByDate (setGridHidden) — 연간투자한도 열을 숨길지 */
    @GetMapping("/info/setting")
    public ApiResponse<EmpInfoSettingRes> setting(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.setting(principal, stdDate));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdEmpInfo + RD 리포트 Flt02_Rd_EmpInfo → 조회 결과 xlsx) */
    @GetMapping("/info/excel")
    public ResponseEntity<byte[]> downloadInfos(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam String stdDate,
                                                @RequestParam(required = false) String searchText) {
        byte[] body = service.downloadInfos(principal, stdDate, searchText);
        String fileName = "임직원매매현황(" + stdDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }
}
