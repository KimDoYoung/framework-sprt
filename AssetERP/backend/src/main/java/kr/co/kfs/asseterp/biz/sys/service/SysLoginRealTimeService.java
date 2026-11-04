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
}
