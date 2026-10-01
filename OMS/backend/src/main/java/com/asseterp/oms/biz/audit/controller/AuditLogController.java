package com.asseterp.oms.biz.audit.controller;

import com.asseterp.oms.biz.audit.dto.AuditLogRecord;
import com.asseterp.oms.biz.audit.service.AuditLogService;
import com.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 보안 감사 로그 조회 (관리자 전용)
 */
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/list")
    public ApiResponse<List<AuditLogRecord>> searchAuditLogs(@RequestParam(name = "limit", defaultValue = "100") int limit) {
        return ApiResponse.ok(auditLogService.searchAuditLogs(limit));
    }
}
