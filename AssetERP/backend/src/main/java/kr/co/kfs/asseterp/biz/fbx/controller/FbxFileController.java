package kr.co.kfs.asseterp.biz.fbx.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxFileRes;
import kr.co.kfs.asseterp.biz.fbx.service.FbxFileService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

/** 파일보관함의 파일 (AS-IS Fbx01_TabPage_DocList → server/fbx/Fbx03_File + 서블릿 FileUpload mode=filebox·FileDelete mode=filebox·FileDownload fileType=fbxFile) */
@RestController
@RequestMapping("/api/v1/fbx/files")
@RequiredArgsConstructor
public class FbxFileController {

    private final FbxFileService service;

    /** AS-IS fbx.Fbx03_File.selectByOrgAuth */
    @GetMapping
    public ApiResponse<List<FbxFileRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam Long boxId, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.search(principal, boxId, classTreeId));
    }

    /** AS-IS fbx.Fbx03_File.selectByBoxId (F12 파일조회) */
    @GetMapping("/by-box")
    public ApiResponse<List<FbxFileRes>> searchByBoxId(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long boxId,
                                                       @RequestParam(required = false) String fileName,
                                                       @RequestParam(required = false) String regEmpName) {
        return ApiResponse.ok(service.searchByBoxId(principal, boxId, fileName, regEmpName));
    }

    /** AS-IS FileUpload?mode=filebox&boxId&classId (파일 여러 개) → 올린 건수 */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long boxId,
                                       @RequestParam Long classTreeId, @RequestParam("files") List<MultipartFile> files) {
        return ApiResponse.ok(service.upload(principal, boxId, classTreeId, files));
    }

    /** AS-IS FileDelete?mode=filebox&fileId&boxId */
    @DeleteMapping("/{fileId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long fileId, @RequestParam Long boxId) {
        service.delete(principal, boxId, fileId);
        return ApiResponse.ok("파일을 성공적으로 삭제하였습니다.", null);
    }

    /** AS-IS FileDownload?fileType=fbxFile&fileId&boxId */
    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> download(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long fileId, @RequestParam Long boxId) {
        SysFileService.StoredFile stored = service.download(principal, boxId, fileId);
        String encoded = URLEncoder.encode(stored.fileNm(), StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, stored.contentType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encoded + "\"")
                .contentLength(stored.file().length())
                .body(new FileSystemResource(stored.file()));
    }
}
