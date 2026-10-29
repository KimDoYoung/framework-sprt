package kr.co.kfs.asseterp.biz.car.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarUserRes;
import kr.co.kfs.asseterp.biz.car.dto.CarUserSaveReq;
import kr.co.kfs.asseterp.biz.car.mapper.CarUserMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Car02_Grid_User(T10) → server/car/Car02_User.java (selectByInfoId L22 / update L28 / delete L33).
 * car02_user에는 회사 컬럼이 없어 차량정보가 로그인 회사 것일 때만 조회·저장한다(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarUserService {

    private final CarUserMapper mapper;

    /** AS-IS selectByInfoId */
    public List<CarUserRes> search(UserPrincipal user, Long infoId) {
        checkInfo(user, infoId);
        return mapper.selectByInfoId(infoId);
    }

    /** AS-IS update (UpdateDataModel) → 저장된 행(요청 순서). 시작일자·직원은 필수 */
    @Transactional
    public List<CarUserRes> save(UserPrincipal user, List<CarUserSaveReq> rows) {
        for (CarUserSaveReq req : rows) {
            if (req.startDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일자는 필수선택 항목입니다.");
            if (req.personId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "직원은 필수선택 항목입니다.");
            checkInfo(user, req.infoId());
        }
        return rows.stream().map(req -> {
            if (req.userId() != null && req.userId() > 0) {
                if (mapper.update(req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                return mapper.selectById(req.userId());
            }
            long id = mapper.selectNextId();
            mapper.insert(id, req);
            return mapper.selectById(id);
        }).toList();
    }

    /** AS-IS delete → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        for (Long id : ids) {
            CarUserRes row = mapper.selectById(id);
            if (row != null) checkInfo(user, row.infoId());
        }
        return mapper.deleteByIds(ids);
    }

    private void checkInfo(UserPrincipal user, Long infoId) {
        if (infoId == null || mapper.countInfoOfCompany(user.getCompanyId(), infoId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
    }
}
