package kr.co.kfs.asseterp.biz.scm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramVersionRes;
import kr.co.kfs.asseterp.biz.scm.service.ScmProgramService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 프로그램 관리 (AS-IS Scm30_Tab_Program → server/scm/Scm30_Program) (EE19) */
@RestController
@RequestMapping("/api/v1/scm/programs")
@RequiredArgsConstructor
public class ScmProgramController {

    private final ScmProgramService service;

    /** AS-IS scm.Scm30_Program.selectByPaging (useYn '%'=전체 / 'true' / 'false') */
    @GetMapping("/search")
    public ApiResponse<PageRes<ProgramRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam String systemCode,
                                                   @RequestParam(defaultValue = "%") String programType,
                                                   @RequestParam(defaultValue = "%") String useYn,
                                                   @RequestParam(defaultValue = "") String searchText,
                                                   @RequestParam(defaultValue = "0") int offset,
                                                   @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(service.search(principal, systemCode, programType, useYn, searchText, offset, limit));
    }

    /** AS-IS scm.Scm30_Program.selectBySystemCode — 프로그램 Version 조회창 */
    @GetMapping("/versions")
    public ApiResponse<List<ProgramVersionRes>> versions(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(defaultValue = "%") String systemCode,
                                                         @RequestParam(defaultValue = "%") String programType,
                                                         @RequestParam(defaultValue = "%") String programCode) {
        return ApiResponse.ok(service.versions(principal, systemCode, programType, programCode));
    }

    /** AS-IS scm.Scm30_Program.modelUpdate */
    @PutMapping
    public ApiResponse<ProgramRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ProgramSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS FileUpload?mode=scm30 — 파일일괄등록(Scm30_Lookup_MultiUpload). 올린 파일 수 */
    @PostMapping(value = "/multi-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Integer> multiUpload(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestParam String systemCd,
                                            @RequestParam String programType,
                                            @RequestParam("files") List<MultipartFile> files) {
        return ApiResponse.ok(service.multiUpload(principal, systemCd, programType, files));
    }
}
