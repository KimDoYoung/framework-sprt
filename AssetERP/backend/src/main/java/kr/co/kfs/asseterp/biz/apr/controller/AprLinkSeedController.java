package kr.co.kfs.asseterp.biz.apr.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 링크코드로 여는 전자결재 창의 제목·본문 (AS-IS Apr01_Edit_ApprDoc.insertLinkApproval, V17) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprLinkSeedController {

    private final AprLinkSeedService service;

    private static void put(Map<String, String> args, String key, String value) {
        if (value != null) {
            args.put(key, value);
        }
    }

    /** refId = 호출한 원본 화면의 행 번호(A25는 etcLeaveId). DB는 바꾸지 않는다 */
    @GetMapping("/link-seed")
    public ApiResponse<AprLinkSeedRes> seed(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                            @RequestParam String linkCode, @RequestParam(required = false) Long refId,
                                            @RequestParam(required = false) String stdDate, @RequestParam(required = false) String cycleType,
                                            @RequestParam(required = false) String yyyy, @RequestParam(required = false) String mm,
                                            @RequestParam(required = false) String cycleName, @RequestParam(required = false) String ids,
                                            @RequestParam(required = false) String yyyymm, @RequestParam(required = false) String accountName,
                                            @RequestParam(required = false) String actMappingId,
                                            @RequestParam(required = false) String typeName) {
        Map<String, String> args = new HashMap<>();
        put(args, "stdDate", stdDate);
        put(args, "cycleType", cycleType);
        put(args, "yyyy", yyyy);
        put(args, "mm", mm);
        put(args, "cycleName", cycleName);
        put(args, "yyyymm", yyyymm); // A43 여비교통비 관리의 기준년월(yyyy.MM)
        put(args, "accountName", accountName); // A43 계정과목 이름
        put(args, "actMappingId", actMappingId); // D01 연봉계약 — 양식이 둘 이상일 때 Pay06_Lookup_LinkContent에서 고른 계약서 양식(pay06_act_mapping_id)
        put(args, "typeName", typeName); // A10~A12 이익제공(수령) — 신청서 구분 콤보의 이름(제목 앞부분)
        put(args, "ids", ids); // 여러 행을 한 문서로 묶는 코드(A77 기준가 정정 월보고)의 행 ID, 쉼표 구분
        return ApiResponse.ok(service.seed(principal, classTreeId, linkCode, refId, args));
    }
}
