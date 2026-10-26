package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoCorpService;
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

/** 주간사 등록 (AS-IS Sch12_Lookup_IpoCorp → server/sch/Sch12_IpoCorp) */
@RestController
@RequestMapping("/api/v1/sch/ipo-corps")
@RequiredArgsConstructor
public class SchIpoCorpController {

    private final SchIpoCorpService service;

    /** AS-IS sch.Sch12_IpoCorp.selectBySearchText */
    @GetMapping
    public ApiResponse<List<Sch12IpoCorpRes>> search(@RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(searchText));
    }

    /** AS-IS sch.Sch12_IpoCorp.selectByCorpName (Sch10_Tab_Ipo [바로가기], 주간사 하나) */
    @GetMapping("/by-name")
    public ApiResponse<List<Sch12IpoCorpRes>> searchByCorpName(@RequestParam String corpName) {
        return ApiResponse.ok(service.searchByCorpName(corpName));
    }

    /** AS-IS sch.Sch12_IpoCorp.selectByCorpNameList (Sch12_Lookup_IpoCorpList, 주간사 여럿) */
    @GetMapping("/by-names")
    public ApiResponse<List<Sch12IpoCorpRes>> searchByCorpNameList(@RequestParam String corpName) {
        return ApiResponse.ok(service.searchByCorpNameList(corpName));
    }

    /** AS-IS sch.Sch12_IpoCorp.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch12IpoCorpRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch12IpoCorpSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sch.Sch12_IpoCorp.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
