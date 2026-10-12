package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.NoteAdminRes;
import kr.co.kfs.asseterp.biz.emp.dto.NoteAdminSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.OthersRes;
import kr.co.kfs.asseterp.biz.emp.dto.OthersSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpOthersService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 기타정보 탭 (AS-IS Emp02_TabPage_Others → server/emp/Emp02_Others) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpOthersController {

    private final EmpOthersService empOthersService;

    /** AS-IS selectByText 행의 empOthersModel (사람 1명) */
    @GetMapping("/persons/{personId}/others")
    public ApiResponse<OthersRes> getOthers(@AuthenticationPrincipal UserPrincipal principal,
                                            @PathVariable Long personId) {
        return ApiResponse.ok(empOthersService.getOthers(principal, personId));
    }

    /** AS-IS emp.Emp02_Others.updateOne */
    @PutMapping("/others")
    public ApiResponse<OthersRes> updateOthers(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody OthersSaveReq req) {
        return ApiResponse.ok(empOthersService.updateOthers(principal, req));
    }

    /** C03 비고 팝업(Emp02_Edit_Note): AS-IS emp.Emp02_Others.selectById — sys admin만 */
    @GetMapping("/persons/{personId}/note-admin")
    public ApiResponse<NoteAdminRes> getNoteAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                  @PathVariable Long personId) {
        return ApiResponse.ok(empOthersService.getNoteAdmin(principal, personId));
    }

    /** C03 비고 팝업 저장: AS-IS emp.Emp02_Others.modelUpdate — sys admin만 */
    @PutMapping("/persons/{personId}/note-admin")
    public ApiResponse<NoteAdminRes> updateNoteAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable Long personId,
                                                     @RequestBody NoteAdminSaveReq req) {
        return ApiResponse.ok(empOthersService.updateNoteAdmin(principal, personId, req));
    }
}
