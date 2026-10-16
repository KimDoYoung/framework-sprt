package kr.co.kfs.asseterp.biz.push.dto;

import kr.co.kfs.asseterp.common.websocket.dto.WsLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 개인 알림 발송 요청
 *
 * @param username 받는 사용자 로그인 ID (보내는 사람과 같은 회사의 사번 또는 관리자 ID)
 * @param level    중요도 (없으면 INFO)
 * @param link     클릭 시 이동할 화면 경로 (선택)
 * @param refId    관련 업무 데이터 ID (선택)
 * @param companyCode 받는 사용자의 회사 코드 (선택, KFS 관리자만 — 다른 회사 사용자에게 보낼 때. 그 외에는 무시하고 보내는 사람 회사)
 */
public record NotificationReq(
        @NotBlank String username,
        @NotBlank @Size(max = 100) String title,
        @NotBlank @Size(max = 1000) String message,
        WsLevel level,
        @Size(max = 200) String link,
        @Size(max = 100) String refId,
        String companyCode
) {
}
