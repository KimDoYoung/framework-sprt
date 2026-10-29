package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteStatusRes;
import kr.co.kfs.asseterp.biz.att.mapper.AttCommuteStatusMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Att02_Tab_CommuteStatus(T08)·Att02_Tab_PersonStatus(T09) → server/att/Att02_Commute.java
 * (getCommuteStatus L54 / getPersonStatus L67)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttCommuteStatusService {

    private final AttCommuteStatusMapper mapper;

    /** AS-IS getCommuteStatus: 근무일자 하루의 전 사원. 검색어는 `%…%`, personId가 있으면 그 사원만 */
    public List<AttCommuteStatusRes> getCommuteStatus(UserPrincipal user, Long personId, LocalDate baseDate, String searchText) {
        return mapper.getCommuteStatus(user.getCompanyId(), personId, baseDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS getPersonStatus: 로그인 사원 본인의 기간 근태(personId = 로그인 사용자) */
    public List<AttCommuteStatusRes> getPersonStatus(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.getPersonStatus(user.getCompanyId(), user.getUserId(), startDate, closeDate);
    }
}
