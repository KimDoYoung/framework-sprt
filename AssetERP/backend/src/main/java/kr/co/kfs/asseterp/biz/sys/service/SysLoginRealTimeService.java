package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginRealTimeRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysLoginRealTimeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys28_LoginRealTime.java (selectByDate) — Sys28_Lookup_LoginRealTime (EE58) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysLoginRealTimeService {

    private final SysLoginRealTimeMapper mapper;

    public List<LoginRealTimeRes> search(UserPrincipal user) {
        return mapper.selectByDate(user.getUserId());
    }

    /**
     * AS-IS Sys28_LoginRealTime.updateIpAddress — 로그인 직후(LoginPage.openFrame2)와 2분마다(MainFrame update 타이머) 접속 IP의 접속 시각을 갱신한다.
     * 같은 사원·IP 기록이 있으면 시각만 바꾸고, 없으면 새로 넣는다. 회사관리자는 부르지 않는다(MainFrame L426).
     */
    @Transactional
    public void updateIpAddress(UserPrincipal user, String ipAddress) {
        if (user.getUserId() == null || user.getUserId() <= 0) return;
        if (mapper.countByPersonIp(user.getUserId(), ipAddress) > 0) mapper.updateInfo(user.getUserId(), ipAddress);
        else mapper.insertInfo(user.getUserId(), ipAddress);
    }
}
