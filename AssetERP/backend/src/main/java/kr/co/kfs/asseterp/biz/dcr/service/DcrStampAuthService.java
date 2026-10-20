package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrStampAuthSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrStampAuthTreeRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrStampAuthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/dcr/Dcr01_ClassTree.selectByAllWithStampAuth, Dcr40_StampAuth.updateList (G07 Dcr40_Lookup_StampAuth 미사용 문서분류) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrStampAuthService {

    private final DcrStampAuthMapper mapper;

    /** AS-IS selectByAllWithStampAuth(companyId, stampId, typeCode '%') */
    public List<DcrStampAuthTreeRes> searchTree(UserPrincipal user, Long stampId) {
        return mapper.selectTree(user.getCompanyId(), stampId);
    }

    /**
     * AS-IS updateList: 받은 행마다 (인감, 문서분류)의 행이 있으면 예외여부를 고치고 없으면 새 ID로 넣는다.
     * 화면은 트리의 모든 행을 보낸다(AS-IS도 같음). 다른 회사의 인감이면 거절(보안 보강)
     */
    @Transactional
    public void save(UserPrincipal user, Long stampId, List<DcrStampAuthSaveReq> rows) {
        if (mapper.countStamp(user.getCompanyId(), stampId) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "인감을 찾을 수 없습니다");
        }
        for (DcrStampAuthSaveReq r : rows) {
            String exceptYn = "true".equals(r.stampExceptYn()) ? "true" : "false";
            if (mapper.updateExcept(stampId, r.classTreeId(), exceptYn) == 0) {
                mapper.insertExcept(mapper.selectNextId(), stampId, r.classTreeId(), exceptYn);
            }
        }
    }
}
