package kr.co.kfs.asseterp.biz.crd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardManagerRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardUserRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardUserSaveReq;
import kr.co.kfs.asseterp.biz.crd.service.CrdCardService;
import kr.co.kfs.asseterp.biz.crd.service.CrdCardUploadService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

/** 법인카드 및 사용자등록 (AS-IS Crd01_Tab_Card·Crd01_Edit_Card·Crd03_Grid_User → server/crd/Crd01_Card·Crd03_Trans) */
@RestController
@RequestMapping("/api/v1/crd/cards")
@RequiredArgsConstructor
public class CrdCardController {

    private final CrdCardService service;
    private final CrdCardUploadService uploadService;

    /** AS-IS crd.Crd01_Card.selectByText — 검색어는 서버가 "%…%"로 감싼다. managerId 없으면 전체 사용자 */
    @GetMapping
    public ApiResponse<List<CrdCardRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) String searchText,
                                                @RequestParam(defaultValue = "true") boolean useYn,
                                                @RequestParam(required = false) Long managerId) {
        return ApiResponse.ok(service.search(principal, searchText, useYn, managerId));
    }

    /** AS-IS sys.Sys00_Common.selectCardManager — 카드사용자 콤보 */
    @GetMapping("/managers")
    public ApiResponse<List<CrdCardManagerRes>> managers(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.managers(principal, useYn));
    }

    /** AS-IS crd.Crd01_Card.update — 카드 한 장 저장(cardId 없음·0 이하면 새 카드) → 저장한 카드 */
    @PutMapping
    public ApiResponse<CrdCardRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CrdCardSaveReq req) {
        return ApiResponse.ok(service.saveCard(principal, req));
    }

    /** AS-IS crd.Crd02_Data.selectByCardNo 확인 + crd.Crd03_Trans.deleteByCardId + crd.Crd01_Card.delete */
    @DeleteMapping("/{cardId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long cardId) {
        return ApiResponse.ok(service.deleteCard(principal, cardId));
    }

    /** AS-IS crd.Crd03_Trans.selectByCardId */
    @GetMapping("/{cardId}/users")
    public ApiResponse<List<CrdCardUserRes>> searchUsers(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long cardId) {
        return ApiResponse.ok(service.searchUsers(principal, cardId));
    }

    /** AS-IS crd.Crd03_Trans.update → 저장된 행(요청 순서) */
    @PutMapping("/{cardId}/users")
    public ApiResponse<List<CrdCardUserRes>> saveUsers(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long cardId,
                                                       @RequestBody List<CrdCardUserSaveReq> rows) {
        return ApiResponse.ok(service.saveUsers(principal, cardId, rows));
    }

    /** AS-IS crd.Crd03_Trans.delete → 지운 건수 */
    @DeleteMapping("/{cardId}/users")
    public ApiResponse<Integer> deleteUsers(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long cardId,
                                            @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteUsers(principal, cardId, ids));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_카드업로드.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_카드업로드.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(uploadService.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=cardUpload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(uploadService.upload(principal, file));
    }
}
