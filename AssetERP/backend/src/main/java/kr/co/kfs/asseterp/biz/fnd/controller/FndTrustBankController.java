package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanySaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndTrustBankService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 수탁은행정보 관리(관리자 #1103 / 회사별 #1100) (AS-IS Fnd09_Tab_TrustBankManager / Fnd09_Tab_TrustBank → server/fnd/Fnd09_TrustBank) */
@RestController
@RequestMapping("/api/v1/fnd/trust-banks")
@RequiredArgsConstructor
public class FndTrustBankController {

    private final FndTrustBankService service;

    /** AS-IS fnd.Fnd09_TrustBank.selectByCompanyId0 */
    @GetMapping
    public ApiResponse<List<TrustBankRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(defaultValue = "") String searchText,
                                                  @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.search(principal, searchText, useYn));
    }

    /** AS-IS fnd.Fnd09_TrustBank.insertCheck — 원본 서버에 없는 서비스라 서버가 거절 */
    @PutMapping
    public ApiResponse<List<TrustBankRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<TrustBankSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS fnd.Fnd09_TrustBank.selectIcamTrustBank: ICAM가져오기 — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/import")
    public ApiResponse<Void> importIcam(@AuthenticationPrincipal UserPrincipal principal) {
        service.importIcam(principal);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd09_TrustBank.selectByText — P05 조회창. 로그인 회사의 것, 이름 검색 */
    @GetMapping("/lookup")
    public ApiResponse<List<TrustBankRes>> lookup(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.lookup(principal, searchText));
    }

    /** AS-IS fnd.Fnd09_TrustBank.selectByCompanyId (R12 #1100 수탁은행정보 관리) */
    @GetMapping("/company")
    public ApiResponse<List<TrustBankCompanyRes>> searchCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(defaultValue = "") String searchText,
                                                                @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.searchCompany(principal, searchText, useYn));
    }

    /** AS-IS fnd.Fnd09_TrustBank.preUpdate + update (R12 #1100) */
    @PutMapping("/company")
    public ApiResponse<List<TrustBankCompanyRes>> saveCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestBody List<TrustBankCompanySaveReq> rows) {
        return ApiResponse.ok(service.saveCompany(principal, rows));
    }

    /** AS-IS fnd.Fnd09_TrustBank.delete (R12 #1100) */
    @DeleteMapping("/company")
    public ApiResponse<Void> deleteCompany(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestBody List<Long> trustBankIds) {
        service.deleteCompany(principal, trustBankIds);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd09_TrustBank.selectIcamTrustBank (R12 #1100) */
    @PostMapping("/company/import")
    public ApiResponse<Void> importCompanyIcam(@AuthenticationPrincipal UserPrincipal principal) {
        service.importCompanyIcam(principal);
        return ApiResponse.ok(null);
    }
}
