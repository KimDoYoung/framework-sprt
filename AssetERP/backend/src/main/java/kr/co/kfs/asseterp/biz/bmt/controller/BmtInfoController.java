package kr.co.kfs.asseterp.biz.bmt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtInfoRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtInfoSaveReq;
import kr.co.kfs.asseterp.biz.bmt.service.BmtInfoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 전산장비관리 (AS-IS Bmt10_Tab_Info → server/bmt/Bmt10_Info) */
@RestController
@RequestMapping("/api/v1/bmt/infos")
@RequiredArgsConstructor
public class BmtInfoController {

    private final BmtInfoService service;

    /** AS-IS bmt.Bmt10_Info.selectByCompanyId — itemClassCode 없으면 전체('%'), checkYn=폐기건 포함 */
    @GetMapping
    public ApiResponse<List<BmtInfoRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) String itemClassCode,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                @RequestParam(defaultValue = "true") boolean checkYn,
                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, itemClassCode, baseDate, checkYn, searchText));
    }

    /** AS-IS bmt.Bmt10_Info.selectByBaseDate — 한 행 다시 읽기 */
    @GetMapping("/{infoId}")
    public ApiResponse<BmtInfoRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(service.get(principal, infoId, baseDate));
    }

    /** AS-IS bmt.Bmt10_Info.modelUpdate (신규) → 새 ID */
    @PostMapping
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BmtInfoSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS bmt.Bmt10_Info.modelUpdate (수정) */
    @PutMapping("/{infoId}")
    public ApiResponse<Long> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId, @RequestBody BmtInfoSaveReq req) {
        return ApiResponse.ok(service.update(principal, infoId, req));
    }

    /** AS-IS bmt.Bmt10_Info.modelDelete */
    @DeleteMapping("/{infoId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId) {
        service.delete(principal, infoId);
        return ApiResponse.ok(null);
    }
}
