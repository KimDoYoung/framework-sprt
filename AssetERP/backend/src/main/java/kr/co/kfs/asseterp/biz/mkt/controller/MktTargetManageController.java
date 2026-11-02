package kr.co.kfs.asseterp.biz.mkt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktFavoriteRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktItemTypeRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetCompanyRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetCompanySaveReq;
import kr.co.kfs.asseterp.biz.mkt.service.MktTargetManageService;
import kr.co.kfs.asseterp.biz.mkt.service.MktTargetUploadService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** Z05 업무활동등록 (AS-IS Mkt01_Tab_TargetCompany, 메뉴 #1405) — 활동처 목록·편집·삭제·즐겨찾기·엑셀·출력 (server/mkt/Mkt01_TargetCompany). 조회창용 GET ""·/managers·/select 는 MktTargetCompanyController */
@RestController
@RequestMapping("/api/v1/mkt/target-companies")
@RequiredArgsConstructor
public class MktTargetManageController {

    private final MktTargetManageService service;
    private final MktTargetUploadService uploadService;

    /** AS-IS sys.Sys09_Code.selectByCode (CrmItemTypeCode + 전체보기) */
    @GetMapping("/item-types")
    public ApiResponse<List<MktItemTypeRes>> itemTypes(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchItemTypes(principal));
    }

    /** AS-IS erpProductCode == "A1" — 업무활동내역 칸을 보이는지 */
    @GetMapping("/history-enabled")
    public ApiResponse<Boolean> historyEnabled(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.historyEnabled(principal));
    }

    /** AS-IS getSeq */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectByCompanyIdPaging */
    @GetMapping("/list")
    public ApiResponse<PageRes<MktTargetCompanyRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(defaultValue = "%") String itemTypeCode,
                                                            @RequestParam(defaultValue = "true") boolean unUseYn,
                                                            @RequestParam(defaultValue = "") String searchText,
                                                            @RequestParam(defaultValue = "0") long offset,
                                                            @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.search(principal, itemTypeCode, unUseYn, searchText, offset, limit));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectById */
    @GetMapping("/{id:\\d+}")
    public ApiResponse<MktTargetCompanyRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return ApiResponse.ok(service.get(principal, id));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.updateOne */
    @PutMapping
    public ApiResponse<MktTargetCompanyRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MktTargetCompanySaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS mkt.Mkt03_History.checkByTargetCompanyId → 업무활동내역이 있는 활동처 수 */
    @PostMapping("/check-histories")
    public ApiResponse<Integer> checkHistories(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.checkHistories(principal, ids));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectFavoritePaging (Mkt01_Lookup_Favorite) */
    @GetMapping("/favorites")
    public ApiResponse<PageRes<MktFavoriteRes>> favorites(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(defaultValue = "") String searchText,
                                                          @RequestParam(defaultValue = "0") long offset,
                                                          @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchFavorites(principal, searchText, offset, limit));
    }

    /** AS-IS sys.Sys99_Print.insertRdTargetCompany → rdGroupId */
    @PostMapping("/rd-download")
    public ApiResponse<String> rdDownload(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.insertRdDownload(principal));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_업무활동등록.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_업무활동등록.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(uploadService.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=targetCompanyUpload&itemTypeCode=) */
    @PostMapping("/excel")
    public ApiResponse<Void> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String itemTypeCode,
                                    @RequestParam("excelUpload") MultipartFile file) {
        uploadService.upload(principal, itemTypeCode, file);
        return ApiResponse.ok(null);
    }
}
