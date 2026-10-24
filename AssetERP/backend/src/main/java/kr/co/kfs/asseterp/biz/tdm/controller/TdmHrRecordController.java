package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRecordSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmHrRecordService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 인사정보 창 (AS-IS server/tdm/Tdm02_HrRecord) */
@RestController
@RequestMapping("/api/v1/tdm/hr-records")
@RequiredArgsConstructor
public class TdmHrRecordController {

    private final TdmHrRecordService service;

    /** AS-IS tdm.Tdm02_HrRecord.selectByCompanyId — applyCode "0"=미적용건만, "%"=조회기간 */
    @GetMapping
    public ApiResponse<List<HrRecordRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                 @RequestParam(defaultValue = "0") String applyCode,
                                                 @RequestParam(defaultValue = "") String searchText,
                                                 @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, applyCode, searchText, limit));
    }

    /** AS-IS tdm.Tdm02_HrRecord.updateApplyCode */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<HrRecordSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }
}
