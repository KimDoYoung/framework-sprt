package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateDocTypeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrRelateDocTypeService;
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

/** 문서구분에 연결한 문서양식 (AS-IS Dcr06_Lookup_Form → server/dcr/Dcr06_RelateDocType) */
@RestController
@RequestMapping("/api/v1/dcr/relate-doc-types")
@RequiredArgsConstructor
public class DcrRelateDocTypeController {

    private final DcrRelateDocTypeService service;

    /** AS-IS dcr.Dcr06_RelateDocType.selectByClassTreeId */
    @GetMapping
    public ApiResponse<List<DcrRelateDocTypeRes>> search(@RequestParam Long classTreeId) {
        return ApiResponse.ok(service.search(classTreeId));
    }

    /** AS-IS dcr.Dcr06_RelateDocType.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<DcrRelateDocTypeRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<DcrRelateDocTypeSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS dcr.Dcr06_RelateDocType.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
