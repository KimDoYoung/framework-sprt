package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.IssuingEntityRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndIssuingEntityService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 발행기관정보 관리 (AS-IS Fnd07_Tab_IssuingEntity → server/fnd/Fnd07_IssuingEntity + 서블릿 IssuingEntityUpload) */
@RestController
@RequestMapping("/api/v1/fnd/issuing-entities")
@RequiredArgsConstructor
public class FndIssuingEntityController {

    private final FndIssuingEntityService service;

    /** AS-IS fnd.Fnd07_IssuingEntity.selectByCodeName — 발행기관명 "%…%" */
    @GetMapping
    public ApiResponse<List<IssuingEntityRes>> search(@RequestParam(defaultValue = "") String issuingEntityName) {
        return ApiResponse.ok(service.search(issuingEntityName));
    }

    /** AS-IS fnd.Fnd07_IssuingEntity.selectBysearchText (EE91 Fnd07_Lookup_IssuingEntity 기관찾기) */
    @GetMapping("/search")
    public ApiResponse<List<IssuingEntityRes>> searchBySearchText(@RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchBySearchText(searchText));
    }

    /** AS-IS fnd.Fnd07_IssuingEntity.update — 원본 서버에 없는 서비스라 서버가 거절 */
    @PutMapping
    public ApiResponse<List<IssuingEntityRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IssuingEntityRes> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS fnd.Fnd07_IssuingEntity.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        service.delete(principal, ids);
        return ApiResponse.ok(null);
    }

    /** AS-IS 서블릿 IssuingEntityUpload?companyId — [파일업로드]: MS949 텍스트(`|` 구분)를 한 줄씩 등록 */
    @PostMapping("/upload")
    public ApiResponse<Void> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("file") MultipartFile file) {
        service.upload(principal, file);
        return ApiResponse.ok(null);
    }
}
