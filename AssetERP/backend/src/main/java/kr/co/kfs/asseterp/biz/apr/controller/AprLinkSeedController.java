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
                                            @RequestParam(required = false) String typeName,
                                            @RequestParam(required = false) String closeDate, @RequestParam(required = false) String periodString,
                                            @RequestParam(required = false) String checkCycle,
                                            @RequestParam(required = false) String roleId,
                                            @RequestParam(required = false) String stdYear, @RequestParam(required = false) String regNo,
                                            @RequestParam(required = false) String regDate, @RequestParam(required = false) String stdTermCode,
                                            @RequestParam(required = false) String dataYm,
                                            @RequestParam(required = false) String benefitName, @RequestParam(required = false) String benefitCode,
                                            @RequestParam(required = false) String stdDateStr,
                                            @RequestParam(required = false) String isManager,
                                            @RequestParam(required = false) String title) {
        Map<String, String> args = new HashMap<>();
        put(args, "title", title); // A41 이익제공(법인카드) — 화면이 만든 문서 제목(원본 2026-11-06 printModel.string02)
        put(args, "isManager", isManager); // A63 지출결의서 — "false"면 한 건 본문의 승인자 줄이 빠진다(내 지출결의서 Y10, 기본 true)
        put(args, "stdDate", stdDate);
        put(args, "cycleType", cycleType);
        put(args, "yyyy", yyyy);
        put(args, "mm", mm);
        put(args, "cycleName", cycleName);
        put(args, "yyyymm", yyyymm); // A43 여비교통비 관리의 기준년월(yyyy.MM)
        put(args, "accountName", accountName); // A43 계정과목 이름
        put(args, "actMappingId", actMappingId); // D01 연봉계약 — 양식이 둘 이상일 때 Pay06_Lookup_LinkContent에서 고른 계약서 양식(pay06_act_mapping_id)
        put(args, "typeName", typeName); // A10~A12 이익제공(수령) — 신청서 구분 콤보의 이름(제목 앞부분)
        put(args, "closeDate", closeDate); // A09 자기매매 실거래 — 보고 기준일(TempData.closeDate)
        put(args, "periodString", periodString); // A09 — 보고 기간 이름("3월"·"1분기", TempData.periodString)
        put(args, "checkCycle", checkCycle); // B05 계좌개설 — 보고주기(1 분기별·2 월별)
        put(args, "roleId", roleId); // A94 책무이행점검보고서 — 탭의 보고CEO 직책(tdm20_role_id)
        put(args, "stdYear", stdYear); // A15 미사용휴가 지정통보서 — 화면의 해당 연도(기간 계산)
        put(args, "regNo", regNo); // A42 여비교통비 신청서 — 신청번호(emp51_reg_no)
        put(args, "regDate", regDate); // A42 — 기준년월(yyyy.MM, 제목에 들어감)
        put(args, "stdTermCode", stdTermCode); // A70·A71 인사평가 보고 — 평가기간 코드(반기별 회사가 아니면 10)
        put(args, "dataYm", dataYm); // A13 법인카드 내역관리 — 기준년월(yyyy.MM, 마감일은 closeDate)
        put(args, "benefitName", benefitName); // A46~A51 복리후생비 지출결의 — 신청구분 콤보의 이름(제목·본문, V40)
        put(args, "benefitCode", benefitCode); // A46~A51 — 신청구분 코드(계정과목 이름)
        put(args, "stdDateStr", stdDateStr); // A72 임직원매매 책임자보고 — 제목의 "yyyy년 MM월"(V41)
        put(args, "ids", ids); // 여러 행을 한 문서로 묶는 코드(A77 기준가 정정 월보고)의 행 ID, 쉼표 구분
        return ApiResponse.ok(service.seed(principal, classTreeId, linkCode, refId, args));
    }
}
