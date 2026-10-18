package kr.co.kfs.asseterp.biz.rpt.controller;

import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitRes;
import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitSaveReq;
import kr.co.kfs.asseterp.biz.rpt.service.RptFssSubmitService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 금감원 업무보고서 (AS-IS Rpt10_Tab_FssSubmit·Rpt10_Edit_WriteGuide → server/rpt/Rpt10_FssSubmit) */
@RestController
@RequestMapping("/api/v1/rpt/fss-submits")
@RequiredArgsConstructor
public class RptFssSubmitController {

    private final RptFssSubmitService service;

    /** AS-IS rpt.Rpt10_FssSubmit.selectBySearchText */
    @GetMapping
    public ApiResponse<List<RptFssSubmitRes>> search(@RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(searchText));
    }

    /** AS-IS rpt.Rpt10_FssSubmit.modelUpdate → 저장된 행 (submitId 없으면 등록) */
    @PutMapping
    public ApiResponse<RptFssSubmitRes> save(@RequestBody RptFssSubmitSaveReq req) {
        return ApiResponse.ok(service.save(req));
    }

    /** AS-IS rpt.Rpt10_FssSubmit.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(ids));
    }
}
