package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprStatusRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpRelateApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/emp/Emp51_RelateAppr.java(selectByCompanyId L42 / updateCloseYn L130) + Emp52_RelateAppr.java(selectByCompanyId L25 / selectApprId L39 / insert L53 / updateApprId L86)
 * — 여비교통비 관리 (U06). 기준년월(yyyymm, 'yyyy.MM')마다 신청서 목록(Emp51)과 지출결의 상신 한 건(Emp52)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpRelateApprService {

    private final EmpRelateApprMapper mapper;

    /** AS-IS Emp51 selectByCompanyId: 상신·결재중·완료(10·20·30) 신청서, 신청번호 순 */
    public List<RelateApprRes> search(UserPrincipal user, String yyyymm) {
        return mapper.selectByCompanyId(user.getCompanyId(), yyyymm);
    }

    /** AS-IS Emp52 selectByCompanyId (apprChk) — 정확히 한 건일 때만 그 문서, 아니면 null(미상신) */
    public RelateApprStatusRes getStatus(UserPrincipal user, String yyyymm) {
        List<RelateApprStatusRes> list = mapper.selectStatusByCompanyId(user.getCompanyId(), yyyymm);
        return list.size() == 1 ? list.get(0) : null;
    }

    /** AS-IS Emp52 selectApprId: 기준년월의 상신 문서 ID (행이 없으면 원본은 NPE) */
    public Long getApprId(UserPrincipal user, String yyyymm) {
        List<RelateApprStatusRes> list = mapper.selectStatusByCompanyId(user.getCompanyId(), yyyymm);
        if (list.isEmpty() || list.get(0).apprId() == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return list.get(0).apprId();
    }

    /**
     * AS-IS Emp52 insert: 기준년월의 상신 행을 새로 만든다. 이미 있으면 지우고 새 ID로 다시 만든다(원본 동작). → 새 relateApprId
     * (결재 문서 ID는 상신 뒤 {@link #updateApprId})
     */
    @Transactional
    public Long createStatus(UserPrincipal user, String yyyymm) {
        List<RelateApprStatusRes> found = mapper.selectStatusByCompanyId(user.getCompanyId(), yyyymm);
        if (!found.isEmpty()) mapper.deleteStatus(found.get(0).relateApprId());
        Long id = mapper.selectNextId();
        mapper.insertStatus(id, user.getCompanyId(), yyyymm);
        return id;
    }

    /** AS-IS Emp52 updateApprId (회사 조건 추가) */
    @Transactional
    public void updateApprId(UserPrincipal user, Long relateApprId, Long apprId) {
        if (mapper.updateApprId(user.getCompanyId(), relateApprId, apprId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
    }

    /** AS-IS Emp51 updateCloseYn: 기준년월의 모든 신청서를 마감/마감취소 → 바뀐 건수 */
    @Transactional
    public int updateCloseYn(UserPrincipal user, String yyyymm, boolean closeYn) {
        return mapper.updateCloseYn(user.getCompanyId(), yyyymm, String.valueOf(closeYn));
    }
}
