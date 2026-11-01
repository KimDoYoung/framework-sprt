package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.NonDeductTaxRes;
import kr.co.kfs.asseterp.biz.ast.dto.NonDeductTaxSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstDepnService;
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

/** 불공제세액 관리 Ast16_Lookup_NonDeductTax (W11) — AS-IS ast.Ast16_NonDeductTax selectByPurTrId · update · delete */
@RestController
@RequestMapping("/api/v1/ast/non-deduct-taxes")
@RequiredArgsConstructor
public class AstNonDeductTaxController {

    private final AstDepnService service;

    @GetMapping
    public ApiResponse<List<NonDeductTaxRes>> search(@RequestParam Long purTrId) {
        return ApiResponse.ok(service.searchNonDeductTaxes(purTrId));
    }

    /** 요청과 같은 순서로 저장된 ID를 돌려준다 */
    @PutMapping
    public ApiResponse<List<Long>> save(@Valid @RequestBody NonDeductTaxSaveReq req) {
        return ApiResponse.ok(service.saveNonDeductTaxes(req.rows()));
    }

    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteNonDeductTaxes(ids));
    }
}
