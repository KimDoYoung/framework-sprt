package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeCopyReq;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeRes;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltItemTypeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 임직원매매 종목유형관리 (AS-IS Flt05_Tab_ItemTypeAdmin → server/flt/Flt05_ItemType) */
@RestController
@RequestMapping("/api/v1/flt/item-types")
@RequiredArgsConstructor
public class FltItemTypeController {

    private final FltItemTypeService service;

    /** AS-IS flt.Flt05_ItemType.selectBySearchText (companyId 없으면 로그인 회사) */
    @GetMapping
    public ApiResponse<List<ItemTypeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) Long companyId,
                                                 @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, companyId, searchText));
    }

    /** AS-IS flt.Flt05_ItemType.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<ItemTypeRes>> update(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) Long companyId,
                                                 @RequestBody List<ItemTypeSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, companyId, rows));
    }

    /** AS-IS flt.Flt05_ItemType.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam(required = false) Long companyId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, companyId, ids));
    }

    /** AS-IS flt.Flt05_ItemType.selectUseCount (J09 종목유형설정 조회창의 삭제 검사) → 사용 중인 유형 이름(`/` 구분), 없으면 null */
    @PostMapping("/use-check")
    public ApiResponse<String> useCheck(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.selectUsedNames(principal, ids));
    }

    /** AS-IS flt.Flt05_ItemType.insertInitData (등록(복사) — 관리자만) → 복사한 건수 */
    @PostMapping("/copy")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ItemTypeCopyReq req) {
        return ApiResponse.ok(service.insertInitData(principal, req));
    }
}
