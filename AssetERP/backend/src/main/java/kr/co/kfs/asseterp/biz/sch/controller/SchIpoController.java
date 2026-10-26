package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoInterestReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoPrintReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoUserRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch11IpoCompanyRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch11IpoCompanySaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 공모주 일정등록 (AS-IS Sch10_Tab_IpoAdmin → server/sch/Sch10_Ipo) + 공모주 일정조회 (Sch10_Tab_Ipo, Q04) */
@RestController
@RequestMapping("/api/v1/sch/ipos")
@RequiredArgsConstructor
public class SchIpoController {

    private final SchIpoService service;

    /** AS-IS sch.Sch10_Ipo.selectBySearchTextAdmin (dateType 1~6, 날짜 yyyy-MM-dd, marketCode 없으면 전체) */
    @GetMapping
    public ApiResponse<List<Sch10IpoRes>> search(@RequestParam String dateType, @RequestParam String startDate, @RequestParam String closeDate,
                                                 @RequestParam(required = false) String searchText, @RequestParam(required = false) String marketCode) {
        return ApiResponse.ok(service.search(dateType, startDate, closeDate, searchText, marketCode));
    }

    /** AS-IS sch.Sch10_Ipo.selectById */
    @GetMapping("/{ipoId}")
    public ApiResponse<Sch10IpoRes> get(@PathVariable Long ipoId) {
        return ApiResponse.ok(service.get(ipoId));
    }

    /** AS-IS sch.Sch10_Ipo.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch10IpoRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch10IpoSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sch.Sch10_Ipo.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_공모주 일정등록.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_공모주 일정등록.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=ipoUpload) → 등록·갱신한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }

    // ===== 공모주 일정조회 (Q04 Sch10_Tab_Ipo) =====

    /** AS-IS sch.Sch10_Ipo.selectBySearchText (ManagerYn=false, 내 회사의 관심종목·일정공유·청약률 포함) */
    @GetMapping("/user")
    public ApiResponse<List<Sch10IpoUserRes>> searchUser(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String dateType,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                         @RequestParam(required = false) String searchText, @RequestParam(required = false) String marketCode,
                                                         @RequestParam(defaultValue = "false") boolean interestYn) {
        return ApiResponse.ok(service.searchUser(principal, dateType, startDate, closeDate, searchText, marketCode, interestYn));
    }

    /** AS-IS sch.Sch11_IpoCompany.insertInterest (관심종목 등록·제거) → 처리 건수 */
    @PutMapping("/interests")
    public ApiResponse<Integer> interest(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Sch10IpoInterestReq req) {
        return ApiResponse.ok(service.interest(principal, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdIpo → 출력 그룹 ID (RD rdGroupId) */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Sch10IpoPrintReq req) {
        return ApiResponse.ok(service.insertRd(principal, req));
    }

    /** AS-IS sch.Sch02_Share.selectByInfoId3 (일정알림 공유자 창) */
    @GetMapping("/{ipoId}/shares")
    public ApiResponse<List<Sch02ShareRes>> searchShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long ipoId) {
        return ApiResponse.ok(service.searchShares(principal, ipoId));
    }

    /** AS-IS sch.Sch02_Share.selectShareInto — 일정공유 칸 문구 */
    @GetMapping("/{ipoId}/share-info")
    public ApiResponse<String> shareInfo(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long ipoId) {
        return ApiResponse.ok(service.shareInfo(principal, ipoId));
    }

    /** AS-IS sch.Sch02_Share.update → 저장한 행(요청 순서) */
    @PutMapping("/{ipoId}/shares")
    public ApiResponse<List<Sch02ShareRes>> saveShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long ipoId,
                                                       @RequestBody List<Sch02ShareSaveReq> rows) {
        return ApiResponse.ok(service.saveShares(principal, ipoId, rows));
    }

    /** AS-IS sch.Sch02_Share.delete → 지운 건수 */
    @DeleteMapping("/{ipoId}/shares")
    public ApiResponse<Integer> deleteShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long ipoId, @RequestBody List<Long> shareIds) {
        return ApiResponse.ok(service.deleteShares(principal, ipoId, shareIds));
    }

    /** AS-IS sch.Sch11_IpoCompany.selectByIpoId (공모주 알람설정 6칸) — 내 회사 행이 없으면 data가 null */
    @GetMapping("/{ipoId}/company")
    public ApiResponse<Sch11IpoCompanyRes> getCompany(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long ipoId) {
        return ApiResponse.ok(service.getCompany(principal, ipoId));
    }

    /** AS-IS sch.Sch11_IpoCompany.update → 저장한 행 */
    @PutMapping("/{ipoId}/company")
    public ApiResponse<Sch11IpoCompanyRes> saveCompany(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long ipoId,
                                                       @RequestBody Sch11IpoCompanySaveReq req) {
        return ApiResponse.ok(service.saveCompany(principal, ipoId, req));
    }
}
