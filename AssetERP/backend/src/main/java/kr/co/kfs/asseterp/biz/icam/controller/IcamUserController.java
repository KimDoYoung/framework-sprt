package kr.co.kfs.asseterp.biz.icam.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserApprIdReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserSaveReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamUserService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** ICAM 사용자ID 신청서 작성 (AS-IS Icam55_Tab_UserRegAppr, 메뉴 #1314) */
@RestController
@RequestMapping("/api/v1/icam/users")
@RequiredArgsConstructor
public class IcamUserController {

    private final IcamUserService service;

    /** AS-IS icam.Icam55_IcamUser.selectBySearchText */
    @GetMapping
    public ApiResponse<List<IcamUserRes>> search(@RequestParam(required = false) String searchText,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                 @RequestParam(defaultValue = "false") boolean procResult) {
        return ApiResponse.ok(service.search(searchText, startDate, closeDate, procResult));
    }

    /** AS-IS icam.Icam55_IcamUser.update (UpdateDataModel) → 저장된 행 */
    @PutMapping
    public ApiResponse<IcamUserRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamUserSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS icam.Icam55_IcamUser.updateApprId */
    @PutMapping("/{icamUserId}/appr-id")
    public ApiResponse<Void> updateApprId(@PathVariable Long icamUserId, @RequestBody IcamUserApprIdReq req) {
        service.updateApprId(icamUserId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr01_Appr.deleteByApprId (새 결재요청을 진행할 때 기존 문서 삭제) */
    @PostMapping("/appr-delete")
    public ApiResponse<Void> deleteAppr(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamUserApprIdReq req) {
        service.deleteAppr(principal, req.apprId());
        return ApiResponse.ok(null);
    }

    /** AS-IS icam.Icam55_IcamUser.deleteApprId + delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> ids) {
        service.delete(principal, ids);
        return ApiResponse.ok(null);
    }
}
