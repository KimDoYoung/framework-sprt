package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 부서 책무매뉴얼의 점검항목 (AS-IS Tdm43_Lookup_ManlItem → server/tdm/Tdm43_Manl) */
@RestController
@RequestMapping("/api/v1/tdm/manls")
@RequiredArgsConstructor
public class TdmManlController {

    private final TdmManlService service;

    /** AS-IS tdm.Tdm43_Manl.selectByManlOrgId (useYn: % 전체 / true 사용 / false 미사용) */
    @GetMapping
    public ApiResponse<List<ManlItemRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam Long manlOrgId,
                                                 @RequestParam(defaultValue = "%") String useYn,
                                                 @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, manlOrgId, useYn, searchText));
    }

    /** AS-IS tdm.Tdm43_Manl.delete (선택한 한 건) */
    @DeleteMapping("/{manlId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlId, @RequestParam Long manlOrgId) {
        service.delete(principal, manlOrgId, manlId);
        return ApiResponse.ok(null);
    }
}
