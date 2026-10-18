package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateIcsRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateSaveReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrRelateIcsService;
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

/** 문서구분에 연결한 법규 (AS-IS Dcr20_Lookup_Ics → server/dcr/Dcr20_RelateIcs) */
@RestController
@RequestMapping("/api/v1/dcr/relate-ics")
@RequiredArgsConstructor
public class DcrRelateIcsController {

    private final DcrRelateIcsService service;

    /** AS-IS dcr.Dcr20_RelateIcs.selectByDcrClassTreeId */
    @GetMapping
    public ApiResponse<List<DcrRelateIcsRes>> search(@RequestParam Long dcrClassTreeId) {
        return ApiResponse.ok(service.search(dcrClassTreeId));
    }

    /** AS-IS dcr.Dcr20_RelateIcs.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<DcrRelateIcsRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<DcrRelateSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS dcr.Dcr20_RelateIcs.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
