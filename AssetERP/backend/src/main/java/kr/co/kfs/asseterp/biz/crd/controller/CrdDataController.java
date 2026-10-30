package kr.co.kfs.asseterp.biz.crd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataAmountRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataCheckRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataTargetReq;
import kr.co.kfs.asseterp.biz.crd.service.CrdDataService;
import kr.co.kfs.asseterp.biz.crd.service.CrdDataUploadService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 법인카드 내역 업로드 (AS-IS Crd02_Tab_DataUpload·Crd02_Edit_DataUpload → server/crd/Crd02_Data · server/biz/Biz01_Promo · ExcelUpload?uploadType=crdExcelUpload) */
@RestController
@RequestMapping("/api/v1/crd/data")
@RequiredArgsConstructor
public class CrdDataController {

    private final CrdDataService service;
    private final CrdDataUploadService uploadService;

    /** AS-IS crd.Crd02_Data.selectByPaging — confirm: ALL / DONE / NOT_ALL / NOT_EXCEPT_CANCEL */
    @GetMapping
    public ApiResponse<PageRes<CrdDataRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) String searchText,
                                                   @RequestParam(required = false) String dataBankCode,
                                                   @RequestParam(required = false) String dataYm,
                                                   @RequestParam(defaultValue = "ALL") String confirm,
                                                   @RequestParam(defaultValue = "0") long offset,
                                                   @RequestParam(defaultValue = "500") long limit) {
        return ApiResponse.ok(service.search(principal, searchText, dataBankCode, dataYm, confirm, offset, limit));
    }

    /** AS-IS crd.Crd02_Data.selectByAmt */
    @GetMapping("/amount")
    public ApiResponse<CrdDataAmountRes> amount(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) String searchText,
                                                @RequestParam(required = false) String dataBankCode,
                                                @RequestParam(required = false) String dataYm,
                                                @RequestParam(defaultValue = "ALL") String confirm) {
        return ApiResponse.ok(service.amount(principal, searchText, dataBankCode, dataYm, confirm));
    }

    /** AS-IS biz.Biz01_Promo.targetCheck — checkType 1 엑셀업로드 / 2 내역확정 / 3 등록 */
    @GetMapping("/target-check")
    public ApiResponse<CrdDataCheckRes> targetCheck(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam String dataYm, @RequestParam String checkType) {
        return ApiResponse.ok(service.targetCheck(principal, dataYm, checkType));
    }

    /** AS-IS biz.Biz01_Promo.targetListCheck — checkType 1 삭제 / 4 저장 (내역확정은 /confirm-check) */
    @PostMapping("/list-check")
    public ApiResponse<CrdDataCheckRes> listCheck(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String checkType, @RequestBody CrdDataTargetReq req) {
        return ApiResponse.ok(service.targetListCheck(principal, checkType, req));
    }

    /** AS-IS crd.Crd02_Data.update / copyUpdate — dataId가 없거나 0 이하면 새 내역 → 저장한 내역 */
    @PutMapping
    public ApiResponse<CrdDataRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CrdDataSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS crd.Crd02_Data.delete + deleteBiz → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** 선택내역확정(ids)·전체내역확정(조회조건) 전의 확인 */
    @PostMapping("/confirm-check")
    public ApiResponse<CrdDataCheckRes> confirmCheck(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CrdDataTargetReq req) {
        return ApiResponse.ok(service.confirmCheck(principal, req));
    }

    /** AS-IS biz.Biz01_Promo.insertList → 확정한 건수 */
    @PostMapping("/confirm")
    public ApiResponse<Integer> confirm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CrdDataTargetReq req) {
        return ApiResponse.ok(service.confirm(principal, req));
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=crdExcelUpload) → 등록한 내역 수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam("excelUpload") MultipartFile file,
                                       @RequestParam String cardCode, @RequestParam String dataYm) {
        return ApiResponse.ok(uploadService.upload(principal, file, cardCode, dataYm));
    }
}
