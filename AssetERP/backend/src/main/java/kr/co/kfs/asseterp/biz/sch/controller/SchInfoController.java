package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoCopyReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoManagerRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoViewRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01OrgRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01PeriodRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchInfoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 업무일정 등록 (AS-IS Sch01_Tab_Info·Sch01_Lookup_Info·Sch01_Lookup_ManagerModi(Run) → server/sch/Sch01_Info·Sch02_Share) */
@RestController
@RequestMapping("/api/v1/sch/infos")
@RequiredArgsConstructor
public class SchInfoController {

    private final SchInfoService service;

    /** AS-IS sch.Sch01_Info.selectByCloseDate — 기간별 업무일정 조회(O02). shareType: 전체 '%'·나의 스케줄 '1'·공유 스케줄 '2' */
    @GetMapping("/period")
    public ApiResponse<List<Sch01PeriodRes>> searchByPeriod(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                            @RequestParam(required = false) Long classId,
                                                            @RequestParam(required = false, defaultValue = "%") String shareType,
                                                            @RequestParam(required = false, defaultValue = "%") String cycleCode,
                                                            @RequestParam(defaultValue = "false") boolean dailyYn,
                                                            @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByPeriod(principal, startDate, endDate, classId, shareType, cycleCode, dailyYn, searchText));
    }

    /** AS-IS sch.Sch01_Info.selectByOrg — 부서별 업무일정 조회(O03). subOrgYn: 하위부서 포함 */
    @GetMapping("/org")
    public ApiResponse<List<Sch01OrgRes>> searchByOrg(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam Long orgId,
                                                      @RequestParam(defaultValue = "true") boolean subOrgYn,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                      @RequestParam(required = false, defaultValue = "%") String cycleCode,
                                                      @RequestParam(defaultValue = "false") boolean dailyYn,
                                                      @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByOrg(principal, orgId, subOrgYn, startDate, endDate, cycleCode, dailyYn, searchText));
    }

    /** AS-IS sch.Sch01_Info.selectByText — 로그인 사용자가 담당자인 일정 */
    @GetMapping
    public ApiResponse<List<Sch01InfoRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) Long classId,
                                                  @RequestParam(required = false, defaultValue = "%") String cycleCode,
                                                  @RequestParam(required = false, defaultValue = "") String searchText,
                                                  @RequestParam(defaultValue = "false") boolean dailyYn,
                                                  @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, classId, cycleCode, searchText, dailyYn, useYn));
    }

    /** AS-IS sch.Sch01_Info.selectByManagerId — 담당자 변경 창 */
    @GetMapping("/by-manager")
    public ApiResponse<List<Sch01InfoManagerRes>> searchByManager(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long managerId,
                                                           @RequestParam(required = false) Long classId,
                                                           @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByManager(principal, managerId, classId, searchText));
    }

    /** AS-IS LoginUser.getIsUserManager — 담당자 변경 창에서 담당자를 바꿀 수 있는가 */
    @GetMapping("/user-manager")
    public ApiResponse<Boolean> userManager(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.isUserManager(principal));
    }

    /** AS-IS sch.Sch01_Info.selectByDeadLineId — 기간별 업무일정 조회(O02)의 보기 창 */
    @GetMapping("/{infoId}/view")
    public ApiResponse<Sch01InfoViewRes> getView(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId, @RequestParam Long deadlineId) {
        return ApiResponse.ok(service.getView(principal, infoId, deadlineId));
    }

    /** AS-IS sch.Sch01_Info.selectById */
    @GetMapping("/{infoId}")
    public ApiResponse<Sch01InfoRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId) {
        return ApiResponse.ok(service.get(principal, infoId));
    }

    /** AS-IS Sch01_Tab_Info.insertRow + Sch01_Lookup_Info.update01 — 빈 행을 먼저 만든다 → 만든 행 */
    @PostMapping
    public ApiResponse<Sch01InfoRes> create(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.create(principal));
    }

    /** AS-IS sch.Sch01_Info.update → 저장한 행 */
    @PutMapping("/{infoId}")
    public ApiResponse<Sch01InfoRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId, @RequestBody Sch01InfoSaveReq req) {
        return ApiResponse.ok(service.update(principal, infoId, req));
    }

    /** AS-IS sch.Sch01_Info.checkSchInfo + delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> infoIds) {
        return ApiResponse.ok(service.delete(principal, infoIds));
    }

    /** AS-IS sch.Sch01_Info.deleteByInfoId — 등록 창을 저장 없이 닫을 때 새 행 되돌리기 */
    @DeleteMapping("/{infoId}")
    public ApiResponse<Integer> rollback(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId) {
        return ApiResponse.ok(service.rollback(principal, infoId));
    }

    /** AS-IS sch.Sch01_Info.copySchedule — 담당자 변경 처리(이동·복사) */
    @PostMapping("/copy")
    public ApiResponse<Void> copy(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Sch01InfoCopyReq req) {
        service.copy(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS sch.Sch02_Share.selectByInfoId */
    @GetMapping("/{infoId}/shares")
    public ApiResponse<List<Sch02ShareRes>> searchShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId) {
        return ApiResponse.ok(service.searchShares(principal, infoId));
    }

    /** AS-IS sch.Sch02_Share.update → 저장한 행(요청 순서) */
    @PutMapping("/{infoId}/shares")
    public ApiResponse<List<Sch02ShareRes>> saveShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId,
                                                       @RequestBody List<Sch02ShareSaveReq> rows) {
        return ApiResponse.ok(service.saveShares(principal, infoId, rows));
    }

    /** AS-IS sch.Sch02_Share.delete → 지운 수 */
    @DeleteMapping("/{infoId}/shares")
    public ApiResponse<Integer> deleteShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long infoId, @RequestBody List<Long> shareIds) {
        return ApiResponse.ok(service.deleteShares(principal, infoId, shareIds));
    }
}
