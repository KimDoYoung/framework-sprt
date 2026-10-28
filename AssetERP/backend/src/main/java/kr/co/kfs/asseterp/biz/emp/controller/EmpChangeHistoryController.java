package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryLicenseRes;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryPrintReq;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryRewardRes;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryTransRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpChangeHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 사원정보 변경조회 (AS-IS Emp00_Tab_ChangeHistory) */
@RestController
@RequestMapping("/api/v1/emp/change-histories")
@RequiredArgsConstructor
public class EmpChangeHistoryController {

    private final EmpChangeHistoryService service;

    /** AS-IS emp.Emp03_Trans.selectByHistory (일반발령 탭) */
    @GetMapping("/trans")
    public ApiResponse<List<ChangeHistoryTransRes>> searchTrans(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                @RequestParam(required = false, defaultValue = "") String searchText,
                                                                @RequestParam(required = false) String empTransCode) {
        return ApiResponse.ok(service.searchTrans(principal, startDate, closeDate, searchText, empTransCode));
    }

    /** AS-IS emp.Emp08_License.selectByHistory (자격사항 탭) — transCode: 100 재직 · 800 겸직 · 900 퇴직 · 000 전체 */
    @GetMapping("/licenses")
    public ApiResponse<List<ChangeHistoryLicenseRes>> searchLicenses(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                     @RequestParam(required = false, defaultValue = "") String searchText,
                                                                     @RequestParam(required = false, defaultValue = "000") String transCode) {
        return ApiResponse.ok(service.searchLicenses(principal, startDate, searchText, transCode));
    }

    /** AS-IS emp.Emp11_Reward.selectByHistory (상벌내역 탭) */
    @GetMapping("/rewards")
    public ApiResponse<List<ChangeHistoryRewardRes>> searchRewards(@AuthenticationPrincipal UserPrincipal principal,
                                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                   @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchRewards(principal, startDate, closeDate, searchText));
    }

    /** AS-IS sys.Sys99_Print.insertRdEmp03History → 출력 그룹 ID */
    @PostMapping("/trans/rd-print")
    public ApiResponse<String> rdPrintTrans(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChangeHistoryPrintReq req) {
        return ApiResponse.ok(service.insertRdTrans(principal, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdEmp08History → 출력 그룹 ID */
    @PostMapping("/licenses/rd-print")
    public ApiResponse<String> rdPrintLicenses(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChangeHistoryPrintReq req) {
        return ApiResponse.ok(service.insertRdLicense(principal, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdEmp11History → 출력 그룹 ID */
    @PostMapping("/rewards/rd-print")
    public ApiResponse<String> rdPrintRewards(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChangeHistoryPrintReq req) {
        return ApiResponse.ok(service.insertRdReward(principal, req));
    }
}
