package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.JournalMapRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalMapSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActJournalMapService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 거래유형별 분개맵핑의 분개맵핑 (AS-IS Act11_Grid_TrJournalMap → server/act/Act12_JournalMap) */
@RestController
@RequestMapping("/api/v1/act/journal-maps")
@RequiredArgsConstructor
public class ActJournalMapController {

    private final ActJournalMapService service;

    /** AS-IS act.Act12_JournalMap.selectByJournalGroup (로그인 회사) */
    @GetMapping
    public ApiResponse<List<JournalMapRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) String journalGroup) {
        return ApiResponse.ok(service.search(principal, journalGroup));
    }

    /** AS-IS act.Act12_JournalMap.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<JournalMapRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<JournalMapSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS act.Act12_JournalMap.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
