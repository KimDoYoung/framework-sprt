package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateIcrRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateSaveReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrRelateIcrService;
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

/** 문서구분에 연결한 내규 (AS-IS Dcr21_Lookup_Icr → server/dcr/Dcr21_RelateIcr) */
@RestController
@RequestMapping("/api/v1/dcr/relate-icr")
@RequiredArgsConstructor
public class DcrRelateIcrController {

    private final DcrRelateIcrService service;

    /** AS-IS dcr.Dcr21_RelateIcr.selectByDcrClassTreeId */
    @GetMapping
    public ApiResponse<List<DcrRelateIcrRes>> search(@RequestParam Long dcrClassTreeId) {
        return ApiResponse.ok(service.search(dcrClassTreeId));
    }

    /** AS-IS dcr.Dcr21_RelateIcr.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<DcrRelateIcrRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<DcrRelateSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS dcr.Dcr21_RelateIcr.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
