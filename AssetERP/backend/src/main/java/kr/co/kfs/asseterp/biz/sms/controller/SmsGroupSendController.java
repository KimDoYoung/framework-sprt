package kr.co.kfs.asseterp.biz.sms.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendHistoryRes;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendRes;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendSaveReq;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendTargetReq;
import kr.co.kfs.asseterp.biz.sms.service.SmsGroupSendHistoryService;
import kr.co.kfs.asseterp.biz.sms.service.SmsGroupSendService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 고객별 문자발송 (AS-IS Sms03_Tab_SendAdmin → server/sms/Sms03_GroupSend, Sms04_GroupSendHistory) */
@RestController
@RequestMapping("/api/v1/sms/group-sends")
@RequiredArgsConstructor
public class SmsGroupSendController {

    private final SmsGroupSendService service;
    private final SmsGroupSendHistoryService historyService;

    /** AS-IS sms.Sms03_GroupSend.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<GroupSendRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS insertRow()의 새 행 기본값 (회사·생성자·생성일자) */
    @GetMapping("/new-row")
    public ApiResponse<GroupSendRes> newRow(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.newRow(principal));
    }

    /** AS-IS sms.Sms03_GroupSend.update → 저장된 행 */
    @PutMapping
    public ApiResponse<GroupSendRes> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody GroupSendSaveReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }

    /** AS-IS sms.Sms03_GroupSend.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS sms.Sms03_GroupSend.sendGroupMessage — 실제 발송은 SmsSender(기본 구현은 보내지 않음) */
    @PostMapping("/{groupSendId}/send")
    public ApiResponse<Void> send(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long groupSendId,
                                  @RequestBody List<GroupSendTargetReq> targets) {
        service.sendGroupMessage(principal, groupSendId, targets);
        return ApiResponse.ok(null);
    }

    /** AS-IS sms.Sms04_GroupSendHistory.selectByText (전송기록) */
    @GetMapping("/{groupSendId}/histories")
    public ApiResponse<List<GroupSendHistoryRes>> searchHistories(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long groupSendId,
                                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(historyService.search(principal, groupSendId, searchText));
    }
}
