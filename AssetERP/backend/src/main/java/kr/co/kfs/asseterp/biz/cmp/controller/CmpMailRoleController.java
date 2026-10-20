package kr.co.kfs.asseterp.biz.cmp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailRoleSaveReq;
import kr.co.kfs.asseterp.biz.cmp.service.CmpMailRoleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공용메일 권한자 (AS-IS Cmp10_Tab_MailBookList → server/cmp/Cmp11_MailRole, G13). 목록은 CmpMailBookController `{id}/roles` */
@RestController
@RequestMapping("/api/v1/cmp/mail-roles")
@RequiredArgsConstructor
public class CmpMailRoleController {

    private final CmpMailRoleService service;

    /** AS-IS cmp.Cmp11_MailRole.updateList — 새로 넣은 건수 */
    @PutMapping
    public ApiResponse<Integer> saveAll(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CmpMailRoleSaveReq> rows) {
        return ApiResponse.ok(service.saveAll(principal, rows));
    }

    /** AS-IS cmp.Cmp11_MailRole.delete — 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
