package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteAutoReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteHistReq;
import kr.co.kfs.asseterp.biz.att.mapper.AttCommuteHistMapper;
import kr.co.kfs.asseterp.biz.att.mapper.AttCommuteMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Att02_Edit_Commute·Att02_Edit_CommuteBatch·Att02_Tab_CommuteAdmin(T06) → server/att/Att04_CommuteHist.java
 * (updateAuto L37 / insert L63 / insertList L85). 로그인 회사의 출퇴근 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttCommuteHistService {

    private final AttCommuteHistMapper mapper;
    private final AttCommuteMapper commuteMapper;

    /** AS-IS updateAuto: 이력이 없으면 insertAuto, 있으면 updateTimeAuto → 처리 건수 */
    @Transactional
    public int updateAuto(UserPrincipal user, AttCommuteAutoReq req) {
        int done = 0;
        for (Long commuteId : ids(req.commuteIds())) {
            check(user, commuteId);
            if (mapper.selectByCommuteId(commuteId).isEmpty()) {
                mapper.insertAuto(commuteId, user.getUserId(), "근로시간 일괄조정");
            } else {
                mapper.updateTimeAuto(commuteId, user.getUserId(), "근로시간 일괄조정");
            }
            done++;
        }
        return done;
    }

    /** AS-IS insert(개별수정 "개별수정") / insertList(일괄수정 "일괄수정"): 이력이 없으면 insert, 있으면 updateTime → 처리 건수 */
    @Transactional
    public int insertList(UserPrincipal user, AttCommuteHistReq req, String changeReason) {
        int done = 0;
        for (Long commuteId : ids(req.commuteIds())) {
            check(user, commuteId);
            if (mapper.selectByCommuteId(commuteId).isEmpty()) {
                mapper.insert(commuteId, user.getUserId(), changeReason, req.checkInTime(), req.checkInTimeStr(),
                        req.checkOutTime(), req.checkOutTimeStr());
            } else {
                mapper.updateTime(commuteId, user.getUserId(), changeReason, req.checkInTime(), req.checkInTimeStr(),
                        req.checkOutTime(), req.checkOutTimeStr());
            }
            done++;
        }
        return done;
    }

    private List<Long> ids(List<Long> commuteIds) {
        return commuteIds == null ? List.of() : commuteIds;
    }

    private void check(UserPrincipal user, Long commuteId) {
        if (commuteMapper.countInCompany(user.getCompanyId(), commuteId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
    }
}
