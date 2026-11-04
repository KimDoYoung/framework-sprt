package kr.co.kfs.asseterp.biz.pln.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.pln.dto.PlnResrchRes;
import kr.co.kfs.asseterp.biz.pln.dto.PlnResrchSaveReq;
import kr.co.kfs.asseterp.biz.pln.mapper.PlnResrchMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 리서치 일정 창 (AS-IS server/pln/Pln03_Resrch.java) */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PlnResrchService {

    private final PlnResrchMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** AS-IS Pln03_Resrch.selectDetailInit L56-72 — 새 건 초기값. 승인자(결재규칙 40)를 못 찾으면 AS-IS도 빈 모델이다 → 데이터 없음 */
    @Transactional
    public PlnResrchRes init(UserPrincipal user) {
        Long orgId = transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        PlnResrchRes res = mapper.selectDetailInit(user.getUserId(), orgId);
        if (res == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return res;
    }

    /** AS-IS Pln03_Resrch.selectById L24-28 */
    public PlnResrchRes get(Long resrchId) {
        PlnResrchRes res = mapper.selectById(resrchId);
        if (res == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return res;
    }

    /** AS-IS Pln03_Resrch.update L140-145 — pln03_resrch.insert(있으면 UPDATE, 없으면 INSERT) */
    @Transactional
    public void save(UserPrincipal user, PlnResrchSaveReq req) {
        if (req == null || req.resrchId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        if (mapper.countById(req.resrchId()) > 0) {
            if (mapper.update(user.getUserId(), req) == 0) throw new BusinessException(ErrorCode.ACCESS_DENIED);
        } else {
            mapper.insert(user.getUserId(), req);
        }
    }

    /** AS-IS Pln03_Resrch.closeUpdate L106-120 — 승인요청(close true)·요청취소(false) */
    @Transactional
    public void close(UserPrincipal user, Long resrchId, boolean close) {
        if (mapper.closeUpdate(resrchId, user.getUserId(), close) == 0) throw new BusinessException(ErrorCode.ACCESS_DENIED);
    }

    /** AS-IS Pln03_Resrch.apprUpdate L122-138 — 확인자 승인 */
    @Transactional
    public void confirm(UserPrincipal user, Long resrchId) {
        if (mapper.apprUpdate(resrchId, user.getUserId()) == 0) throw new BusinessException(ErrorCode.ACCESS_DENIED);
    }
}
