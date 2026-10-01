package kr.co.kfs.asseterp.oms.biz.push.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.auth.service.AuthService;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OnlinePersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.service.EmpPersonService;
import kr.co.kfs.asseterp.oms.biz.push.dto.OnlineUserRes;
import kr.co.kfs.asseterp.oms.biz.push.dto.PresenceItemRes;
import kr.co.kfs.asseterp.oms.biz.user.dto.LoginAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * 로그아웃 알림 관리 (AS-IS Sys86_Tab_Websocket). AS-IS BroadcastWebsocket 접속자 목록 → TOBE presence.
 * 알림 전송은 기존 PushService(notice/notification)를 그대로 쓴다.
 */
@Service
@RequiredArgsConstructor
public class PushAdminService {

    private final PresenceService presenceService;
    private final EmpPersonService empPersonService;
    private final AuthService authService;

    /** 접속 중 사원 (AS-IS selectByLoginUserPaging). 회사관리자(음수 세션 ID)는 AS-IS처럼 제외 */
    public List<OnlineUserRes> searchOnlineUsers(Long companyId, String searchText) {
        Map<Long, List<PresenceItemRes>> sessionsByUser = new LinkedHashMap<>();
        for (PresenceItemRes item : presenceService.searchPresence()) {
            if (item.userId() != null && LoginAccount.isEmployeeSessionId(item.userId())) {
                sessionsByUser.computeIfAbsent(item.userId(), k -> new ArrayList<>()).add(item);
            }
        }
        List<OnlineUserRes> result = new ArrayList<>();
        for (OnlinePersonRes p : empPersonService.searchOnlinePersons(new ArrayList<>(sessionsByUser.keySet()), companyId, searchText)) {
            List<PresenceItemRes> sessions = sessionsByUser.get(p.personId());
            result.add(new OnlineUserRes(p.personId(), sessions.get(0).username(), p.companyNm(), p.korNm(), p.empNo(),
                    p.posNm(), p.officeTelNo(), p.mobileTelNo(), sessions.size()));
        }
        return result;
    }

    /** AS-IS 개별로그아웃 → 처리한 사용자 수 */
    public int forceLogout(List<Long> userIds, UserPrincipal admin) {
        if (userIds == null) {
            return 0;
        }
        List<Long> targets = userIds.stream().filter(Objects::nonNull).filter(id -> !id.equals(admin.getUserId())).distinct().toList();
        targets.forEach(id -> authService.forceLogout(id, admin.getUsername()));
        return targets.size();
    }

    /** AS-IS 전체로그아웃: 접속 중인 모든 사용자(자신 제외) → 처리한 사용자 수 */
    public int forceLogoutAll(UserPrincipal admin) {
        List<Long> userIds = presenceService.searchPresence().stream().map(PresenceItemRes::userId).toList();
        return forceLogout(userIds, admin);
    }
}
