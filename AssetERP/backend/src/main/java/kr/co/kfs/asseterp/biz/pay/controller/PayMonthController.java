package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayApprCheckRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthGroupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthPersonRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthWorkTimeReq;
import kr.co.kfs.asseterp.biz.pay.service.PayMonthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 급여관리 Pay10_Tab_Month (S16) — AS-IS pay.Pay10_Month */
@RestController
@RequestMapping("/api/v1/pay/months")
@RequiredArgsConstructor
public class PayMonthController {

    private final PayMonthService service;

    /** pay.Pay10_Month.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<PayMonthRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam String payCode,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate) {
        return ApiResponse.ok(service.search(principal, payCode, payDate));
    }

    /** pay.Pay10_Month.selectByYear — 지급구분/일자 조회(Pay10_Lookup_GroupList) */
    @GetMapping("/groups")
    public ApiResponse<List<PayMonthGroupRes>> groups(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam String year,
                                                      @RequestParam(defaultValue = "%") String payCode,
                                                      @RequestParam(required = false) String code) {
        return ApiResponse.ok(service.searchGroups(principal, year, payCode, code));
    }

    /** pay.Pay10_Month.selectByYearPersonId — 본인 급여(S20 급여명세서, 사원은 로그인 사용자) */
    @GetMapping("/mine")
    public ApiResponse<List<PayMonthPersonRes>> mine(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year) {
        return ApiResponse.ok(service.searchMine(principal, year));
    }

    /** pay.Pay10_Month.selectByYearPersonId — 고른 사원의 급여(S21 급여명세서(경영관리팀)) */
    @GetMapping("/by-person")
    public ApiResponse<List<PayMonthPersonRes>> byPerson(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam Long personId, @RequestParam String year) {
        return ApiResponse.ok(service.searchByPerson(principal, personId, year));
    }

    /** pay.Pay10_Month.selectByMonthIdCount — 본인 급여의 지급·공제 항목 수 중 큰 값(S20 RD 보고서 num) */
    @GetMapping("/mine/{monthId}/item-count")
    public ApiResponse<Long> mineItemCount(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long monthId) {
        return ApiResponse.ok(service.itemCount(principal, monthId, true));
    }

    /** pay.Pay10_Month.selectByMonthIdCount — 지급·공제 항목 수 중 큰 값(S21 RD 보고서 num) */
    @GetMapping("/{monthId}/item-count")
    public ApiResponse<Long> itemCount(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long monthId) {
        return ApiResponse.ok(service.itemCount(principal, monthId, false));
    }

    /** pay.Pay10_Month.checkAppr — 실패여도 200, ok=false + 문구 */
    @GetMapping("/check-appr")
    public ApiResponse<PayApprCheckRes> checkAppr(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String payCode,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate,
                                                  @RequestParam(required = false) Long monthId) {
        return ApiResponse.ok(service.checkAppr(principal, payCode, payDate, monthId));
    }

    /** pay.Pay10_Month.insert — 급여 생성 */
    @PostMapping
    public ApiResponse<Void> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayMonthCreateReq req) {
        service.create(principal, req);
        return ApiResponse.ok(null);
    }

    /** pay.Pay10_Month.deleteAll → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> monthIds) {
        return ApiResponse.ok(service.delete(principal, monthIds));
    }

    /** pay.Pay10_Month.modelUpdate — 근로시간 팝업 [저장] */
    @PutMapping("/{monthId}/work-time")
    public ApiResponse<Integer> updateWorkTime(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long monthId,
                                               @RequestBody PayMonthWorkTimeReq req) {
        return ApiResponse.ok(service.updateWorkTime(principal, monthId, req));
    }
}
