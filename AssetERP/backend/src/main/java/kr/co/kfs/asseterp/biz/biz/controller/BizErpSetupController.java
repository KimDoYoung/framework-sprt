package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpMailFormReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpMailFormRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpNoteReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpSetupRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpSetupSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizErpSetupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** AssetERP 기본설정 (AS-IS server/biz/Biz50_ErpSetup — 화면 Biz50_Lookup_ErpSetup·Biz50_Lookup_MailMapping, EE22) */
@RestController
@RequestMapping("/api/v1/biz/erp-setups")
@RequiredArgsConstructor
public class BizErpSetupController {

    private final BizErpSetupService service;

    /** AS-IS biz.Biz50_ErpSetup.selectAll */
    @GetMapping
    public ApiResponse<List<BizErpSetupRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS biz.Biz50_ErpSetup.selectByStartDate — 없으면 data null */
    @GetMapping("/current")
    public ApiResponse<BizErpSetupRes> current(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.current(principal, stdDate));
    }

    /** AS-IS biz.Biz50_ErpSetup.update */
    @PutMapping
    public ApiResponse<List<BizErpSetupRes>> save(@RequestBody List<BizErpSetupSaveReq> rows) {
        return ApiResponse.ok(service.save(rows));
    }

    /** AS-IS biz.Biz50_ErpSetup.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> erpSetupIds) {
        return ApiResponse.ok(service.delete(erpSetupIds));
    }

    /** AS-IS biz.Biz50_ErpSetup.getNote — 메모가 없으면 data null */
    @GetMapping("/note")
    public ApiResponse<String> note() {
        return ApiResponse.ok(service.note());
    }

    /** AS-IS biz.Biz50_ErpSetup.updateNote */
    @PutMapping("/note")
    public ApiResponse<Void> saveNote(@RequestBody BizErpNoteReq req) {
        service.saveNote(req.note());
        return ApiResponse.ok(null);
    }

    /** AS-IS biz.Biz50_ErpSetup.selectMailForm — 아직 없으면 data null */
    @GetMapping("/mail-form")
    public ApiResponse<BizErpMailFormRes> mailForm() {
        return ApiResponse.ok(service.mailForm());
    }

    /** AS-IS biz.Biz50_ErpSetup.insertMailForm — erpSetupId 가 없으면 새 메일양식 행 */
    @PutMapping("/mail-form")
    public ApiResponse<BizErpMailFormRes> saveMailForm(@RequestBody BizErpMailFormReq req) {
        return ApiResponse.ok(service.saveMailForm(req));
    }
}
