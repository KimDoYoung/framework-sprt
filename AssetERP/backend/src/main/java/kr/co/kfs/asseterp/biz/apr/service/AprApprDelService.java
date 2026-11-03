package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDelCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDelRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprDelMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/** 폐기문서 복구 (AS-IS Apr01_Tab_Restore → server/apr/Apr99_ApprDel) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprDelService {

    private final AprApprDelMapper mapper;

    /** AS-IS selectByCompanyId — 회사는 서버가 세션에서. 입력 없으면 '%', 있으면 '%값%' (retrieve L209-229) */
    public List<AprApprDelRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String orgName, String personName, String aprName) {
        return mapper.selectByCompanyId(new AprApprDelCond(user.getCompanyId(), startDate, closeDate, like(orgName), like(personName), like(aprName)));
    }

    private String like(String v) {
        return v == null || v.isEmpty() ? "%" : "%" + v + "%";
    }

    /** AS-IS Apr99_ApprDel.restore L43-62: apr01로 되돌림 → apr99 삭제 → 폐기신청(apr90) 삭제 → 폐기이력(apr91, 코드 "30") 남김. 하나라도 실패하면 모두 되돌린다 */
    @Transactional
    public void restore(UserPrincipal user, Long apprId) {
        try {
            if (mapper.restore(user.getCompanyId(), apprId) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            mapper.deleteApprId(apprId);
            mapper.deleteDisposalListByApprId(apprId);
            mapper.insertDisposalHistory(user.getCompanyId(), user.getUserId(), LocalDateTime.now(), apprId, "30");
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "폐기문서 복구 중 문제가 발생했습니다. 관리자에게 문의하세요");
        }
    }
}
