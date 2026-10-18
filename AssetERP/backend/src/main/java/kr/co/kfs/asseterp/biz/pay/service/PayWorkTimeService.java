package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayWorkTimeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/pay/Pay34_WorkTimeConfig.java (selectByCompanyId L24 / update L44 / delete L49).
 * 화면이 회사 0을 고정으로 조회하는 공통 표라 저장·삭제는 관리자 회사만 한다(보안 보강, E21과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayWorkTimeService {

    /** AS-IS retrieve(): service.addParam("companyId", 0l) */
    private static final long COMMON_COMPANY_ID = 0L;

    private final PayWorkTimeMapper mapper;

    public List<PayWorkTimeRes> search() {
        return mapper.selectByCompanyId(COMMON_COMPANY_ID);
    }

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서). 원본도 필수값 검사 없음(열이 모두 NULL 허용) */
    @Transactional
    public List<PayWorkTimeRes> save(UserPrincipal user, List<PayWorkTimeSaveReq> rows) {
        requireSysAdmin(user);
        return rows.stream().map(req -> {
            boolean exists = req.workTimeConfigId() != null && req.workTimeConfigId() > 0 && mapper.selectById(req.workTimeConfigId()) != null;
            if (exists) {
                if (mapper.update(user.getCompanyId(), req) == 0) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                return mapper.selectById(req.workTimeConfigId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, user.getCompanyId(), req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
