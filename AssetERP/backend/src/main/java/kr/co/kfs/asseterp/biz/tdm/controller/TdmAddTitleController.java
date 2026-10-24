package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.AddTitleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmAddTitleService;
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

/** 직무겸직(사내) (AS-IS server/tdm/Tdm03_AddTitle) */
@RestController
@RequestMapping("/api/v1/tdm/add-titles")
@RequiredArgsConstructor
public class TdmAddTitleController {

    private final TdmAddTitleService service;

    @GetMapping
    public ApiResponse<List<AddTitleRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam Long personId) {
        return ApiResponse.ok(service.search(principal, personId));
    }

    @PutMapping
    public ApiResponse<List<AddTitleRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody List<AddTitleSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestBody List<Long> addTitleIds) {
        return ApiResponse.ok(service.delete(principal, addTitleIds));
    }
}
