package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.auth.service.AuthService;
import kr.co.kfs.asseterp.biz.push.dto.NoticeReq;
import kr.co.kfs.asseterp.biz.push.dto.NotificationReq;
import kr.co.kfs.asseterp.biz.push.dto.PresenceItemRes;
import kr.co.kfs.asseterp.biz.push.service.PresenceService;
import kr.co.kfs.asseterp.biz.push.service.PushService;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketPersonRes;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketPersonsParam;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketResultRes;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketTarget;
import kr.co.kfs.asseterp.biz.sys.mapper.SysWebsocketMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.websocket.dto.WsLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * AS-IS Sys86_Tab_Websocket(로그아웃 알림 관리) — server/emp/Emp01_Person.selectByLoginUserPaging L69, frm/Frm01_List.getWebsocketList L78,
 * 클라이언트 JSNI sendWebSocketAlarmMessage·sendWebSocketForce. 접속 중인 사용자는 TOBE의 {@link PresenceService}로, 알림은 {@link PushService},
 * 강제 로그아웃은 {@link AuthService#forceLogout}으로 보낸다. 전 고객사를 다루는 관리자 화면 → sys admin만.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysWebsocketService {

    /** AS-IS 알림에는 제목이 없었다 — TOBE 알림은 제목이 필요해 고정 문구 */
    static final String ALARM_TITLE = "알림";

    private final SysWebsocketMapper mapper;
    private final PresenceService presenceService;
    private final PushService pushService;
    private final AuthService authService;

    /** 지금 접속 중인 사용자 ID(사원 + 회사관리자). 사원은 emp01_person_id, 회사관리자는 음수 (UserPrincipal.userId) */
    Set<Long> onlineUserIds() {
        Set<Long> ids = new LinkedHashSet<>();
        for (PresenceItemRes item : presenceService.searchPresence()) {
            if (item.userId() != null) {
                ids.add(item.userId());
            }
        }
        return ids;
    }

    /** AS-IS retrieve() L250-277: 접속 중인 사원 중 고객사·검색어에 맞는 사원(100건 페이지). companyId null = 전체 */
    public PageRes<WebsocketPersonRes> search(UserPrincipal user, Long companyId, String searchText, int offset, int limit) {
        requireSysAdmin(user);
        List<Long> loginList = onlineUserIds().stream().filter(id -> id > 0).toList();
        if (loginList.isEmpty()) {
            return new PageRes<>(0, List.of());
        }
        WebsocketPersonsParam param = new WebsocketPersonsParam(companyId, "%" + (searchText == null ? "" : searchText) + "%", loginList,
                Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(mapper.selectByLoginUserTotal(param), mapper.selectByLoginUserPaging(param));
    }

    /** AS-IS SendMessage.sendMessage L119-161: 고른 사원 중 접속 중인 사원에게 알림, 오프라인 사원은 이름을 돌려준다 */
    @Transactional
    public WebsocketResultRes sendAlarm(UserPrincipal user, List<Long> personIds, String message) {
        requireSysAdmin(user);
        requireMessage(message);
        Set<Long> online = onlineUserIds();
        List<String> offline = new ArrayList<>();
        int sent = 0;
        for (WebsocketTarget target : targetsOf(personIds)) {
            if (online.contains(target.personId())) {
                pushService.createNotification(new NotificationReq(target.empNo(), ALARM_TITLE, message, WsLevel.INFO, null, null, target.companyCode()), user);
                sent++;
            } else {
                offline.add(target.korName());
            }
        }
        return new WebsocketResultRes(sent, offline);
    }

    /** AS-IS SendMessage.sendMessageAll L163-180: 접속한 모두에게 알림(공지) */
    @Transactional
    public WebsocketResultRes sendAlarmAll(UserPrincipal user, String message) {
        requireSysAdmin(user);
        requireMessage(message);
        pushService.createNotice(new NoticeReq(ALARM_TITLE, message, WsLevel.INFO), user);
        return new WebsocketResultRes(onlineUserIds().size(), List.of());
    }

    /** AS-IS sendForceLogout() L348-382: 고른 사원 중 접속 중인 사원을 강제 로그아웃, 오프라인 사원은 이름을 돌려준다 */
    @Transactional
    public WebsocketResultRes forceLogout(UserPrincipal user, List<Long> personIds) {
        requireSysAdmin(user);
        Set<Long> online = onlineUserIds();
        List<String> offline = new ArrayList<>();
        int done = 0;
        for (WebsocketTarget target : targetsOf(personIds)) {
            if (online.contains(target.personId())) {
                authService.forceLogout(target.personId(), user.getUsername());
                done++;
            } else {
                offline.add(target.korName());
            }
        }
        return new WebsocketResultRes(done, offline);
    }

    /** AS-IS sendForceLogoutAll() L384-392: 접속한 모든 사용자(요청한 관리자 자신 포함 — 원본과 같다)를 강제 로그아웃 */
    @Transactional
    public WebsocketResultRes forceLogoutAll(UserPrincipal user) {
        requireSysAdmin(user);
        Set<Long> online = onlineUserIds();
        for (Long userId : online) {
            authService.forceLogout(userId, user.getUsername());
        }
        return new WebsocketResultRes(online.size(), List.of());
    }

    private List<WebsocketTarget> targetsOf(List<Long> personIds) {
        if (personIds == null || personIds.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 사원이 없습니다");
        }
        return mapper.selectTargets(personIds);
    }

    private void requireMessage(String message) {
        if (message == null || message.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "알림내용을 입력해주세요");
        }
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
