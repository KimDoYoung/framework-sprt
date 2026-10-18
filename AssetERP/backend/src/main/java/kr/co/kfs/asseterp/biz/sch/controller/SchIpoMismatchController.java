package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch14IpoMismatchRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch14IpoMismatchSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoMismatchService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공모주일정 미일치내역 (AS-IS Sch14_Lookup_IpoMismatch → server/sch/Sch14_IpoMismatch) */
@RestController
@RequestMapping("/api/v1/sch/ipo-mismatches")
@RequiredArgsConstructor
public class SchIpoMismatchController {

    private final SchIpoMismatchService service;

    /** AS-IS sch.Sch14_IpoMismatch.createIpoMismatch + selectByCheckYn — 조회가 쓰기(미일치내역을 새로 만든다) */
    @GetMapping
    public ApiResponse<List<Sch14IpoMismatchRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam boolean checkYn) {
        return ApiResponse.ok(service.search(principal, checkYn));
    }

    /** AS-IS sch.Sch14_IpoMismatch.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch14IpoMismatchRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch14IpoMismatchSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }
}
