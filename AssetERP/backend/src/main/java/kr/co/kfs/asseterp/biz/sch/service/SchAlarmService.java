package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmSaveReq;
import kr.co.kfs.asseterp.biz.sch.mapper.SchAlarmMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 알람설정 (O01) — AS-IS Sch06_Lookup_AlarmSetup → server/sch/Sch06_Alarm.java (selectByTargetId L23 / update L28 / delete L33). 회사는 로그인 회사 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchAlarmService {

    private final SchAlarmMapper mapper;

    /** AS-IS Sch06_Alarm.selectByTargetId */
    public List<Sch06AlarmRes> search(UserPrincipal user, Long targetId) {
        return mapper.selectByTargetId(user.getCompanyId(), targetId);
    }

    /** AS-IS Sch06_Alarm.update(UpdateDataModel): 새 행(≤ 0)은 INSERT, 있는 행은 UPDATE → 저장한 행(요청 순서) */
    @Transactional
    public List<Sch06AlarmRes> save(UserPrincipal user, List<Sch06AlarmSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Sch06AlarmRes> saved = new ArrayList<>();
        for (Sch06AlarmSaveReq req : rows) {
            Long id = req.alarmId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertAlarm(companyId, id, req);
            } else if (mapper.updateAlarm(companyId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "알람설정을 찾을 수 없습니다.");
            }
            saved.add(mapper.selectById(companyId, id));
        }
        return saved;
    }

    /** AS-IS Sch06_Alarm.delete(UpdateDataModel.deleteModel) → 지운 수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> alarmIds) {
        if (alarmIds == null || alarmIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteAlarms(user.getCompanyId(), alarmIds);
    }
}
