package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferBookReq;
import kr.co.kfs.asseterp.biz.flt.dto.RightsExerciseRes;
import kr.co.kfs.asseterp.biz.flt.dto.RightsExerciseSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltRightsExerciseService;
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

/** 임직원매매 권리행사/기타입출고 (AS-IS Flt10_Tab_RightsExercise · Flt10_Lookup_RightsExercise → server/flt/Flt10_Tr) */
@RestController
@RequestMapping("/api/v1/flt/rights-exercises")
@RequiredArgsConstructor
public class FltRightsExerciseController {

    private final FltRightsExerciseService service;

    /** AS-IS flt.Flt10_Tr.selectByTrType — 로그인 사용자 본인, trType 생략(전체) = '%' */
    @GetMapping
    public ApiResponse<List<RightsExerciseRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) String trType,
                                                       @RequestParam(required = false) Long accountId,
                                                       @RequestParam String startDate,
                                                       @RequestParam String closeDate,
                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, trType, accountId, startDate, closeDate, searchText));
    }

    /** AS-IS flt.Flt10_Tr.update (GridUpdate) */
    @PutMapping
    public ApiResponse<List<RightsExerciseRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<RightsExerciseSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt10_Tr.delete2 (GridDeleteData) — 행을 지우고 그 종목의 원장을 다시 만든다 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS flt.Flt10_Tr.insertFloorTrBook — 저장 뒤 원장정리(종목 한정) */
    @PostMapping("/book")
    public ApiResponse<Integer> insertFloorTrBook(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AcntTransferBookReq req) {
        service.insertFloorTrBook(principal, req);
        return ApiResponse.ok(1);
    }
}
