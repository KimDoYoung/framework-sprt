package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EventRes;
import kr.co.kfs.asseterp.biz.emp.dto.EventSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEventMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/emp12_event.xml */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEventService {

    private final EmpEventMapper empEventMapper;

    public List<EventRes> getEvents(UserPrincipal user, Long personId) {
        return empEventMapper.selectEvents(user.getCompanyId(), personId);
    }

    @Transactional
    public List<EventRes> updateEvents(UserPrincipal user, List<EventSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (EventSaveReq req : rows) {
            if (req.eventId() == null || req.eventId() <= 0) {
                Long newId = empEventMapper.selectNextEventId();
                empEventMapper.insertEvent(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empEventMapper.updateEvent(req.eventId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.eventId());
            }
        }
        return resultIds.stream().map(empEventMapper::selectEventById).toList();
    }

    @Transactional
    public int deleteEvents(UserPrincipal user, List<Long> eventIds) {
        if (eventIds == null || eventIds.isEmpty()) return 0;
        return empEventMapper.deleteEvents(eventIds, user.getCompanyId());
    }
}
