package kr.co.kfs.asseterp.biz.frm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.frm.dto.FrmNoticeCntRes;
import kr.co.kfs.asseterp.biz.frm.service.FrmListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 알림 창 (AS-IS Frm01_Lookup_CheckList · MainFrame.checkActive → server/frm/Frm01_List, EE53) */
@RestController
@RequestMapping("/api/v1/frm/lists")
@RequiredArgsConstructor
public class FrmListController {

    private final FrmListService service;

    /** AS-IS frm.Frm01_List.getNoticeCnt */
    @GetMapping("/notice-count")
    public ApiResponse<FrmNoticeCntRes> getNoticeCnt(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getNoticeCnt(principal));
    }
}
