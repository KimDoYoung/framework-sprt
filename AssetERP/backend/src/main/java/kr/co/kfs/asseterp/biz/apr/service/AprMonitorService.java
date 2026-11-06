package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorOutstandingRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorRequestRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorTemporaryRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprMonitorMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/Apr01_Appr.java (selectOutstanding L891 · selectMonitorngAppr L950 · selectTemporary L965) — MyPage 전자결재 박스(Monitoring_Page_Appr) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprMonitorService {

    private final AprMonitorMapper mapper;

    public List<AprMonitorOutstandingRes> searchOutstanding(UserPrincipal user) {
        return mapper.selectOutstanding(user.getCompanyId(), user.getUserId());
    }

    /** AS-IS toDay = LoginUser.getToday() → 서버 오늘 */
    public List<AprMonitorRequestRes> searchRequest(UserPrincipal user) {
        return mapper.selectMonitorngAppr(user.getCompanyId(), user.getUserId(), LocalDate.now());
    }

    public List<AprMonitorTemporaryRes> searchTemporary(UserPrincipal user) {
        return mapper.selectTemporary(user.getCompanyId(), user.getUserId());
    }
}
