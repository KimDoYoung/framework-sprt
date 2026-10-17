package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.ManualRes;
import kr.co.kfs.asseterp.biz.sys.dto.ManualSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysManualService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** AssetERP 매뉴얼 (AS-IS Sys95_Tab_Manual·Sys95_Tab_ManualAdmin → server/sys/Sys95_Manual). 조회(공개)는 로그인한 사용자 모두, 관리는 sys admin */
@RestController
@RequestMapping("/api/v1/sys/manuals")
@RequiredArgsConstructor
public class SysManualController {

    private final SysManualService service;

    /** AS-IS sys.Sys95_Manual.selectByText (publicCheck=true: A33 공개된 것만, false: A34 전체 — 관리자만) */
    @GetMapping
    public ApiResponse<List<ManualRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam(required = false) String manualType,
                                               @RequestParam(required = false) String searchText,
                                               @RequestParam(defaultValue = "true") boolean publicCheck) {
        return ApiResponse.ok(service.search(principal, manualType, searchText, publicCheck));
    }

    /** AS-IS FileUpload?mode=sys95&manualType= → 만들어진 매뉴얼 */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ManualRes> upload(@AuthenticationPrincipal UserPrincipal principal,
                                         @RequestParam String manualType, @RequestParam MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, manualType, file));
    }

    /** AS-IS sys.Sys95_Manual.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<ManualRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ManualSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys95_Manual.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS sys.Sys95_Manual.checkManualType — 사용 중이면 오류(Sys09_Lookup_Code 행 삭제 전 검사) */
    @GetMapping("/check-type")
    public ApiResponse<Void> checkManualType(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String manualType) {
        service.checkManualType(principal, manualType);
        return ApiResponse.ok(null);
    }
}
