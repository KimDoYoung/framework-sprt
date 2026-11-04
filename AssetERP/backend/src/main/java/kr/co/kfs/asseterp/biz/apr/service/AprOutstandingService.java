package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprOutstandingRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprOutstandingMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/apr/Apr01_Appr.java (selectOutstandingPopup) — Frm01_Lookup_Outstanding (EE56) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprOutstandingService {

    private final AprOutstandingMapper mapper;

    public List<AprOutstandingRes> searchOutstanding(UserPrincipal user) {
        return mapper.selectOutstandingPopup(user.getUserId());
    }
}
