package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.OthersRes;
import kr.co.kfs.asseterp.biz.emp.dto.OthersSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpOthersMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/emp/Emp02_Others.java (updateOne) — 기타정보 탭 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpOthersService {

    private final EmpOthersMapper empOthersMapper;

    /** AS-IS retrieve(): 목록 행의 empOthersModel → 사람 1명으로 읽는다 */
    public OthersRes getOthers(UserPrincipal user, Long personId) {
        OthersRes res = empOthersMapper.selectOthers(user.getCompanyId(), personId);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return res;
    }

    /** AS-IS updateOne: emp02_others.upsert 1건. 원본은 결과를 돌려주지 않지만 화면이 폼·목록 행을 바꾸도록 다시 읽어 준다 */
    @Transactional
    public OthersRes updateOthers(UserPrincipal user, OthersSaveReq req) {
        if (req.personId() == null || empOthersMapper.selectOthers(user.getCompanyId(), req.personId()) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        empOthersMapper.upsertOthers(req);
        return empOthersMapper.selectOthers(user.getCompanyId(), req.personId());
    }
}
