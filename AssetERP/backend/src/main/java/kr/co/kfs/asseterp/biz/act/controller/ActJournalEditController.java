package kr.co.kfs.asseterp.biz.act.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.act.dto.JournalEditRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActJournalEditService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 전표변경 Act02_Lookup_ModiJournal (W05 2단계) — AS-IS act.Act06_JournalTmp.selectByJournalId · act.Act02_Journal.updateAll */
@RestController
@RequestMapping("/api/v1/act/journals")
@RequiredArgsConstructor
public class ActJournalEditController {

    private final ActJournalEditService service;

    /** 전표 머리 + 임시분개 줄 */
    @GetMapping("/{journalId}/edit")
    public ApiResponse<JournalEditRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long journalId) {
        return ApiResponse.ok(service.get(principal, journalId));
    }

    /** act.Act02_Journal.updateAll */
    @PutMapping("/{journalId}")
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long journalId, @Valid @RequestBody JournalSaveReq req) {
        service.save(principal, journalId, req);
        return ApiResponse.ok(null);
    }
}
