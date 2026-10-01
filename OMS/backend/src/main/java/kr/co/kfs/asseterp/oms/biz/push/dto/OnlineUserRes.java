package kr.co.kfs.asseterp.oms.biz.push.dto;

/**
 * 접속 중 사원 (AS-IS Sys86_Tab_Websocket 그리드): presence(접속 세션) + 사원 정보
 *
 * @param userId   세션 사용자 ID (사원 = emp01_person_id)
 * @param username 알림 대상 식별자 (NotificationReq.username)
 * @param sessions 접속 세션(탭·기기) 수
 */
public record OnlineUserRes(Long userId, String username, String companyNm, String korNm, String empNo, String posNm,
                            String officeTelNo, String mobileTelNo, int sessions) {
}
