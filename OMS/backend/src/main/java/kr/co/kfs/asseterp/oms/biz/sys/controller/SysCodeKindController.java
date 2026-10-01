package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysCodeKindService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공통코드 종류 (AS-IS sys.Sys08_CodeKind). 조회는 누구나, 저장·삭제는 KFS 관리자 */
@RestController
@RequestMapping("/api/v1/sys/code-kinds")
@RequiredArgsConstructor
public class SysCodeKindController {

    private final SysCodeKindService sysCodeKindService;

    /** sysYn: 'true' / 'false'(기본) / '%'(전체) */
    @GetMapping
    public ApiResponse<List<CodeKindRes>> searchCodeKinds(@RequestParam(required = false) String kindNm,
                                                          @RequestParam(required = false) String sysYn) {
        return ApiResponse.ok(sysCodeKindService.searchCodeKinds(kindNm, sysYn));
    }

    @PutMapping
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<CodeKindRes>> updateCodeKinds(@RequestBody List<CodeKindSaveReq> rows) {
        return ApiResponse.ok(sysCodeKindService.updateCodeKinds(rows));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> deleteCodeKinds(@RequestBody List<Long> codeKindIds) {
        return ApiResponse.ok(sysCodeKindService.deleteCodeKinds(codeKindIds));
    }
}
