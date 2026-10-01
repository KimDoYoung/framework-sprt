package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsagePeriodRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsageRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.TrashFileRes;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 파일 저장소 (AS-IS Sys10_Tab_TotalSize, Sys10_Tab_TrashFileList → sys.Sys10_File). 전 고객사 데이터라 KFS 관리자(SYSADMIN)만 */
@RestController
@RequestMapping("/api/v1/sys/files")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SYSADMIN')")
public class SysFileController {

    private final SysFileService sysFileService;

    /** 고객별 서버사용량 */
    @GetMapping("/usage")
    public ApiResponse<List<FileUsageRes>> searchUsage(@RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(sysFileService.searchUsage(useYn));
    }

    /** 고객(서브도메인)의 연도별 사용량 */
    @GetMapping("/usage/{locNm}/years")
    public ApiResponse<List<FileUsagePeriodRes>> searchUsageByYear(@PathVariable String locNm) {
        return ApiResponse.ok(sysFileService.searchUsageByYear(locNm));
    }

    /** 고객(서브도메인)의 그 연도 월별 사용량 */
    @GetMapping("/usage/{locNm}/months")
    public ApiResponse<List<FileUsagePeriodRes>> searchUsageByMonth(@PathVariable String locNm, @RequestParam String year) {
        return ApiResponse.ok(sysFileService.searchUsageByMonth(locNm, year));
    }

    /** 미사용 파일 */
    @GetMapping("/trash")
    public ApiResponse<List<TrashFileRes>> searchTrashFiles() {
        return ApiResponse.ok(sysFileService.searchTrashFiles());
    }
}
