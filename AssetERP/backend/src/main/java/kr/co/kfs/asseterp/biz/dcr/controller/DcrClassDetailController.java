package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassDetailRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassDetailSaveReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrClassDetailService;
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

/** 문서분류 세부분류 (AS-IS Dcr07_Lookup_ClassDetail → server/dcr/Dcr07_ClassDetail) */
@RestController
@RequestMapping("/api/v1/dcr/class-details")
@RequiredArgsConstructor
public class DcrClassDetailController {

    private final DcrClassDetailService service;

    /** AS-IS dcr.Dcr07_ClassDetail.selectByClassTreeId */
    @GetMapping
    public ApiResponse<List<DcrClassDetailRes>> search(@RequestParam Long classTreeId) {
        return ApiResponse.ok(service.search(classTreeId));
    }

    /** AS-IS dcr.Dcr07_ClassDetail.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<DcrClassDetailRes>> save(@RequestBody List<DcrClassDetailSaveReq> rows) {
        return ApiResponse.ok(service.save(rows));
    }

    /** AS-IS dcr.Dcr07_ClassDetail.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(ids));
    }
}
