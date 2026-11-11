package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteAnswerReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteApprIdReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteCreateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteFixReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteReasonReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceWriteService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 내부통제 준수확인서 작성 (AS-IS Ics31_Tab_ComplianceWrite·Ics31_Edit_Reason → server/ics/Ics31_ComplianceWrite) — 메뉴 #1310 */
@RestController
@RequestMapping("/api/v1/ics/compliance-writes")
@RequiredArgsConstructor
public class IcsComplianceWriteController {

    private final IcsComplianceWriteService service;

    /** AS-IS settings()의 sys.Sys01_Company.selectById — 체크주기(M 월 / Q 분기), 설정이 없으면 null */
    @GetMapping("/cycle-type")
    public ApiResponse<String> cycleType(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.cycleType(principal));
    }

    /** 회사 설정 임직원준수점검 상신자(LoginUser.getCompanyModel().getComplyApprRegEmpType()) — '1' = 작성자 결재요청(A53), 원본 2026-11-04·05 */
    @GetMapping("/appr-reg-emp-type")
    public ApiResponse<String> apprRegEmpType(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.apprRegEmpType(principal));
    }

    /** AS-IS ics.Ics32_RelateAppr.selectApprCheck (A53) — 그 달 내 상신 상태, 없으면 null */
    @GetMapping("/appr")
    public ApiResponse<IcsComplianceWriteApprRes> appr(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate, @RequestParam String cycleType) {
        return ApiResponse.ok(service.appr(principal, stdDate, cycleType));
    }

    /** AS-IS ics.Ics32_RelateAppr.selectApprList (A53) — 그 달 내 상신 문서 ID들 */
    @GetMapping("/appr-ids")
    public ApiResponse<List<Long>> apprIds(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate, @RequestParam String cycleType) {
        return ApiResponse.ok(service.apprIds(principal, stdDate, cycleType));
    }

    /** AS-IS ics.Ics32_RelateAppr.selectLastAppr — 최근 상신 문서의 문서분류 ID, 없으면 null */
    @GetMapping("/last-class-tree-id")
    public ApiResponse<Long> lastClassTreeId(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.lastClassTreeId(principal));
    }

    /** AS-IS ics.Ics32_RelateAppr.insertApprId (A53 상신 뒤) */
    @PostMapping("/appr-id")
    public ApiResponse<Void> insertApprId(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceWriteApprIdReq req) {
        service.insertApprId(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS ics.Ics30_Compliance.selectByPersonId — stdDate = 기준 분기(월)의 말일 */
    @GetMapping
    public ApiResponse<List<IcsComplianceWriteRes>> list(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                         @RequestParam String cycleType, @RequestParam boolean checkBox) {
        return ApiResponse.ok(service.list(principal, stdDate, cycleType, checkBox));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.updateAnswerCode — 예·아니오·해당없음 */
    @PutMapping("/answers")
    public ApiResponse<IcsComplianceWriteItem> updateAnswerCode(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestBody IcsComplianceWriteAnswerReq req) {
        return ApiResponse.ok(service.updateAnswerCode(principal, req));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.modelUpdate(새 행) — 사유 창을 처음 열 때 */
    @PostMapping
    public ApiResponse<IcsComplianceWriteItem> create(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestBody IcsComplianceWriteCreateReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.selectById */
    @GetMapping("/{complianceWriteId}")
    public ApiResponse<IcsComplianceWriteItem> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long complianceWriteId) {
        return ApiResponse.ok(service.get(principal, complianceWriteId));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.modelUpdate — 사유 저장 */
    @PutMapping("/{complianceWriteId}/reason")
    public ApiResponse<IcsComplianceWriteItem> updateReason(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long complianceWriteId,
                                                            @RequestBody IcsComplianceWriteReasonReq req) {
        return ApiResponse.ok(service.updateReason(principal, complianceWriteId, req.reason()));
    }

    /** AS-IS ics.Ics30_Compliance.selectConfirmer — 확인자 선택창의 기본 확인자 */
    @GetMapping("/confirmer")
    public ApiResponse<IcsComplianceConfirmerRes> confirmer(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.confirmer(principal, stdDate));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.updateFixYn — 제출·제출취소 */
    @PutMapping("/fix")
    public ApiResponse<Integer> updateFixYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceWriteFixReq req) {
        return ApiResponse.ok(service.updateFixYn(principal, req));
    }

    /** AS-IS ics.Ics31_ComplianceWrite.deleteByPersonId — 새로작성(내 작성 내역 삭제) */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate, @RequestParam String cycleType) {
        return ApiResponse.ok(service.deleteByPersonId(principal, stdDate, cycleType));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdComplianceWrite + RD 리포트 Ics31_Rd_ComplianceWrite → 한 시트 xlsx) */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                           @RequestParam String cycleType, @RequestParam boolean checkBox,
                                           @RequestParam(required = false) String fileName) {
        byte[] body = service.download(principal, stdDate, cycleType, checkBox);
        String name = (fileName == null || fileName.isBlank() ? "내부통제 준수확인서(" + stdDate + ")" : fileName) + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(name, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }
}
