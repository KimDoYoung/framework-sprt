package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndOprFundService;
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
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 수요예측 펀드별 신청 (AS-IS server/fnd/Fnd31_OprFund) */
@RestController
@RequestMapping("/api/v1/fnd/opr-funds")
@RequiredArgsConstructor
public class FndOprFundController {

    private final FndOprFundService service;

    /** AS-IS fnd.Fnd31_OprFund.selectByOprId (Fnd31_Page_DemandOprFund.retrieve) */
    @GetMapping
    public ApiResponse<List<OprFundRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long oprId) {
        return ApiResponse.ok(service.search(principal, oprId));
    }

    /** AS-IS fnd.Fnd31_OprFund.modelUpdate (Fnd31_Edit_DemandOprFund.update) */
    @PutMapping
    public ApiResponse<OprFundRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OprFundSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS fnd.Fnd31_OprFund.delete (Fnd31_Page_DemandOprFund.deleteRow) */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long oprId, @RequestBody List<Long> oprFundIds) {
        service.delete(principal, oprId, oprFundIds);
        return ApiResponse.ok(null);
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_공모주 수요예측 신청.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_공모주 수요예측 신청.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=demandOprFundUpload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long oprId,
                                       @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, oprId, file));
    }
}
