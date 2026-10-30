package kr.co.kfs.asseterp.biz.act.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.act.dto.ActRelateApprAddReq;
import kr.co.kfs.asseterp.biz.act.dto.ActRelateApprDeleteReq;
import kr.co.kfs.asseterp.biz.act.dto.ActRelateApprRes;
import kr.co.kfs.asseterp.biz.act.service.ActRelateApprService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 연관문서 Act80_Lookup_RelateAppr (W05 2단계 ⓑ) — AS-IS act.Act80_RelateAppr · act.Act02_Journal.selectOneJournalIdByTrId */
@RestController
@RequestMapping("/api/v1/act/relate-apprs")
@RequiredArgsConstructor
public class ActRelateApprController {

    private final ActRelateApprService service;

    /** code = trId | journalId */
    @GetMapping
    public ApiResponse<List<ActRelateApprRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam String code, @RequestParam Long relateId) {
        return ApiResponse.ok(service.search(principal, code, relateId));
    }

    /** 거래에 걸린 전표 ID — 없으면 data null (파일 업로드 단추를 막는다) */
    @GetMapping("/journal-id")
    public ApiResponse<Long> journalIdByTr(@RequestParam Long trId) {
        return ApiResponse.ok(service.getJournalIdByTr(trId));
    }

    @PostMapping
    public ApiResponse<Void> add(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ActRelateApprAddReq req) {
        service.add(principal, req);
        return ApiResponse.ok(null);
    }

    @PostMapping("/delete")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ActRelateApprDeleteReq req) {
        service.delete(principal, req.relateApprIds());
        return ApiResponse.ok(null);
    }
}
