package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FileMonthRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileTotalRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileYearRes;
import kr.co.kfs.asseterp.biz.sys.dto.TrashFileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.sys.service.SysRelateFileService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 파일 공통 (B10) — AS-IS 서블릿 FileUpload·FileDownload·FileDelete, 서비스 sys.Sys10_File.selectByParentId·sys.Sys11_RelateFile.checkFileDelete.
 * 로그인한 사용자면 누구나 (원본도 권한 검사 없음 — 사용자 결정 2026-10-13).
 */
@RestController
@RequestMapping("/api/v1/sys/files")
@RequiredArgsConstructor
public class SysFileController {

    private final SysFileService sysFileService;
    private final SysRelateFileService sysRelateFileService;

    /** AS-IS sys.Sys10_File.selectByParentId */
    @GetMapping
    public ApiResponse<List<FileRes>> searchByParentId(@RequestParam Long parentId) {
        return ApiResponse.ok(sysFileService.searchByParentId(parentId));
    }

    /** AS-IS sys.Sys10_File.selectByTotalSize (A16 고객별 서버사용량 — sys admin만, 위 "로그인만"의 예외) */
    @GetMapping("/totals")
    public ApiResponse<List<FileTotalRes>> getTotals(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(sysFileService.selectByTotalSize(principal, useYn));
    }

    /** AS-IS sys.Sys10_File.findTrashFile (A17 미사용 파일조회 — sys admin만) */
    @GetMapping("/trash")
    public ApiResponse<List<TrashFileRes>> findTrashFile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(sysFileService.findTrashFile(principal));
    }

    /** AS-IS sys.Sys10_File.selectByTotalSizeYear */
    @GetMapping("/totals/years")
    public ApiResponse<List<FileYearRes>> getTotalYears(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String locName) {
        return ApiResponse.ok(sysFileService.selectByTotalSizeYear(principal, locName));
    }

    /** AS-IS sys.Sys10_File.selectByTotalSizeMonth */
    @GetMapping("/totals/months")
    public ApiResponse<List<FileMonthRes>> getTotalMonths(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam String locName, @RequestParam String year) {
        return ApiResponse.ok(sysFileService.selectByTotalSizeMonth(principal, locName, year));
    }

    /** AS-IS FileUpload?parentId=&[mode=emp01]&[fileYn=] (폼 항목 fileField → file) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileRes> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long parentId,
                                       @RequestParam(required = false) String mode, @RequestParam(required = false) String fileYn,
                                       @RequestPart("file") MultipartFile file) {
        return ApiResponse.ok("파일을 성공적으로 등록하였습니다.", sysFileService.upload(principal, parentId, mode, fileYn, file));
    }

    /** AS-IS FileDownload?fileType=image&(fileId=|parentId=) — 사진 (화면에 그대로 보임) */
    @GetMapping("/image")
    public ResponseEntity<Resource> getImage(@RequestParam(required = false) Long fileId, @RequestParam(required = false) Long parentId) {
        return toResponse(sysFileService.getImage(fileId, parentId), "inline");
    }

    /** AS-IS FileDownload?fileType=selectList&selectList=id,id,… — 고른 파일들의 zip ("Asset-ERP.zip") */
    @GetMapping("/zip")
    public ResponseEntity<StreamingResponseBody> downloadZip(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> fileIds) {
        return toZipResponse(sysFileService.getZipEntries(principal, fileIds), "Asset-ERP");
    }

    /** AS-IS FileDownload?fileType=apprList&selectList=apprId,apprId,… — 고른 문서들의 본문·첨부파일 zip ("Asset-ERP_DOC.zip", F09) */
    @GetMapping("/appr-zip")
    public ResponseEntity<StreamingResponseBody> downloadApprZip(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> apprIds) {
        return toZipResponse(sysFileService.getApprZipEntries(principal, apprIds), "Asset-ERP_DOC");
    }

    private ResponseEntity<StreamingResponseBody> toZipResponse(List<SysFileService.StoredFile> entries, String outputName) {
        StreamingResponseBody body = out -> {
            try (ZipOutputStream zip = new ZipOutputStream(out)) {
                zip.setLevel(8);
                for (SysFileService.StoredFile entry : entries) {
                    ZipEntry zipEntry = new ZipEntry(entry.fileNm());
                    zipEntry.setTime(entry.file().lastModified());
                    zip.putNextEntry(zipEntry);
                    Files.copy(entry.file().toPath(), zip);
                    zip.closeEntry();
                }
            }
        };
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/zip")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + outputName + ".zip\"")
                .body(body);
    }

    /** AS-IS FileDownload?fileType=file&fileId= */
    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> download(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long fileId) {
        return toResponse(sysFileService.getDownload(principal, fileId), "attachment");
    }

    /** AS-IS sys.Sys11_RelateFile.checkFileDelete → 1 연결만 지움 / 2 다른 상신문서에서 사용 중 / 3 지워도 됨 */
    @PostMapping("/{fileId}/check-delete")
    public ApiResponse<Integer> checkFileDelete(@PathVariable Long fileId, @RequestParam Long parentId) {
        return ApiResponse.ok(sysRelateFileService.checkFileDelete(fileId, parentId));
    }

    /** AS-IS FileDelete?fileId= */
    @DeleteMapping("/{fileId}")
    public ApiResponse<Void> delete(@PathVariable Long fileId) {
        sysFileService.delete(fileId);
        return ApiResponse.ok("파일을 성공적으로 삭제하였습니다.", null);
    }

    /** AS-IS FileDownload.download L65-90: filename은 URL 인코딩(+ → %20) */
    private static ResponseEntity<Resource> toResponse(SysFileService.StoredFile stored, String disposition) {
        String encoded = URLEncoder.encode(stored.fileNm(), StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, stored.contentType())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + encoded + "\"")
                .contentLength(stored.file().length())
                .body(new FileSystemResource(stored.file()));
    }
}
