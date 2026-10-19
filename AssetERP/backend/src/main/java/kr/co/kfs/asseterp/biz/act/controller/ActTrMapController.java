package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.TrMapInitReq;
import kr.co.kfs.asseterp.biz.act.dto.TrMapRes;
import kr.co.kfs.asseterp.biz.act.dto.TrMapSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActTrMapService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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

/** 거래유형별 분개맵핑의 거래맵핑 (AS-IS Act11_Tab_TrJournalMap(메뉴 #1168·#1162) → server/act/Act11_TrMap) */
@RestController
@RequestMapping("/api/v1/act/tr-maps")
@RequiredArgsConstructor
public class ActTrMapController {

    private final ActTrMapService service;

    /** AS-IS act.Act11_TrMap.selectByCompanyId (로그인 회사) */
    @GetMapping
    public ApiResponse<List<TrMapRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam(required = false) String searchText,
                                              @RequestParam(required = false) String journalGroup) {
        return ApiResponse.ok(service.search(principal, searchText, journalGroup));
    }

    /** AS-IS act.Act11_TrMap.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<TrMapRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<TrMapSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS act.Act11_TrMap.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS act.Act11_TrMap.insertInitData (기초데이터생성 — 관리자만) → 처리한 고객사 수 */
    @PostMapping("/init-data")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TrMapInitReq req) {
        return ApiResponse.ok(service.insertInitData(principal, req));
    }
}
