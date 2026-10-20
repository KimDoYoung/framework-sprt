package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateFileAddReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateFileRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsRelateFileService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법규 서식파일 (AS-IS Ics01_Lookup_IcsFile·Ics01_Lookup_IcsFileAdmin → server/sys/Sys11_RelateFile·Sys10_File) */
@RestController
@RequestMapping("/api/v1/ics")
@RequiredArgsConstructor
public class IcsRelateFileController {

    private final IcsRelateFileService service;

    /** AS-IS sys.Sys11_RelateFile.selectByParentId */
    @GetMapping("/laws/{classTreeId}/files")
    public ApiResponse<List<IcsRelateFileRes>> search(@PathVariable Long classTreeId) {
        return ApiResponse.ok(service.searchByParentId(classTreeId));
    }

    /** AS-IS sys.Sys11_RelateFile.insert(relateId, tableName ics01_class_tree) → 새로 연결한 건수 */
    @PostMapping("/laws/{classTreeId}/files")
    public ApiResponse<Integer> insert(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                       @RequestBody IcsRelateFileAddReq req) {
        return ApiResponse.ok(service.insert(principal, classTreeId, req.fileIds()));
    }

    /** AS-IS sys.Sys11_RelateFile.delete → 지운 건수 */
    @DeleteMapping("/laws/{classTreeId}/files")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                       @RequestBody List<Long> relateFileIds) {
        return ApiResponse.ok(service.delete(principal, classTreeId, relateFileIds));
    }

    /** AS-IS sys.Sys10_File.getIcsFile: 불러오기 창의 서식파일 목록 */
    @GetMapping("/form-files")
    public ApiResponse<List<IcsFormFileRes>> searchFormFiles(@RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchFormFiles(searchText));
    }

    /** AS-IS sys.Sys10_File.getIcsFile(lawType null): 법규보고 서식파일 화면(Ics01_Tab_IcsFileUser, H07)의 목록 */
    @GetMapping("/form-files/user")
    public ApiResponse<List<IcsFormFileRes>> searchFormFilesUser(@RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchFormFilesUser(searchText));
    }
}
