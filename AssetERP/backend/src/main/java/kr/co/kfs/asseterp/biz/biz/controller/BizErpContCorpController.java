package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.biz.dto.BizErpContCorpRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpContCorpSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizErpContCorpService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** AssetERP 계약사 관리 (AS-IS server/biz/Biz51_ErpContCorp — 화면 Biz51_Tab_ErpContCorp, EE22) */
@RestController
@RequestMapping("/api/v1/biz/erp-cont-corps")
@RequiredArgsConstructor
public class BizErpContCorpController {

    private final BizErpContCorpService service;

    /** AS-IS biz.Biz51_ErpContCorp.selectByContStatusCode */
    @GetMapping
    public ApiResponse<List<BizErpContCorpRes>> search(@RequestParam(required = false) String contStatusCode,
                                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(contStatusCode, searchText));
    }

    /** AS-IS getSeq */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS biz.Biz51_ErpContCorp.selectById */
    @GetMapping("/{erpContCorpId}")
    public ApiResponse<BizErpContCorpRes> get(@PathVariable Long erpContCorpId) {
        return ApiResponse.ok(service.get(erpContCorpId));
    }

    /** AS-IS biz.Biz51_ErpContCorp.insertUpdate */
    @PostMapping
    public ApiResponse<BizErpContCorpRes> save(@RequestBody BizErpContCorpSaveReq req) {
        return ApiResponse.ok(service.save(req));
    }

    /** AS-IS biz.Biz51_ErpContCorp.deleteList → 지운 계약사 수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> erpContCorpIds) {
        return ApiResponse.ok(service.delete(erpContCorpIds));
    }
}
