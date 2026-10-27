package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.AstCfBatchCreateReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfInfoRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfInfoSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstCfInfoService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ast")
@RequiredArgsConstructor
public class AstCfInfoController {

    private final AstCfInfoService service;

    /** AS-IS ast03_cf_info.selectByClassTreeId */
    @GetMapping("/cf-infos")
    public ApiResponse<List<AstCfInfoRes>> getCfInfoList(@RequestParam Long astClassTreeId) {
        return ApiResponse.ok(service.getCfInfoList(astClassTreeId));
    }

    /** ast03_cf_info CUD */
    @PutMapping("/cf-infos")
    public ApiResponse<List<AstCfInfoRes>> saveCfInfoList(@RequestBody List<AstCfInfoSaveReq> rows) {
        return ApiResponse.ok(service.saveCfInfoList(rows));
    }

    @DeleteMapping("/cf-infos/{id}")
    public ApiResponse<Integer> deleteCfInfo(@PathVariable Long id) {
        return ApiResponse.ok(service.deleteCfInfo(id));
    }

    /** AS-IS ast04_cf.selectByCfInfoId */
    @GetMapping("/cfs")
    public ApiResponse<List<AstCfRes>> getCfList(@RequestParam Long cfInfoId) {
        return ApiResponse.ok(service.getCfList(cfInfoId));
    }

    /** ast04_cf CUD */
    @PutMapping("/cfs")
    public ApiResponse<List<AstCfRes>> saveCfList(@RequestBody List<AstCfSaveReq> rows) {
        return ApiResponse.ok(service.saveCfList(rows));
    }

    @DeleteMapping("/cfs/{id}")
    public ApiResponse<Integer> deleteCf(@PathVariable Long id) {
        return ApiResponse.ok(service.deleteCf(id));
    }

    /** AS-IS ast.Ast03_CfInfo.bacthUpdate */
    @PostMapping("/cf-infos/batch-create")
    public ApiResponse<List<AstCfRes>> batchCreate(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AstCfBatchCreateReq req) {
        return ApiResponse.ok(service.batchCreate(principal, req));
    }
}
