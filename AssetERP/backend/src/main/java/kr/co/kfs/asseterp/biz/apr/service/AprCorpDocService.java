package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRelateRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprCorpDocMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 법인서류 신청내역·연결문서 (AS-IS server/apr/Apr17_CorpDoc.java · Apr18_RelateCorpDoc.java) */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AprCorpDocService {

    private final AprCorpDocMapper mapper;

    /** AS-IS Apr17_CorpDoc.selectByCompanyId L33-39 */
    public List<AprCorpDocRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS Apr17_CorpDoc.regDateUpdate L74-85 — 고른 신청내역의 등록일을 오늘로 */
    @Transactional
    public void regDateUpdate(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        mapper.regDateUpdate(user.getCompanyId(), ids);
    }

    /** AS-IS Apr18_RelateCorpDoc.selectByCorpDocId L26-32 */
    public List<AprCorpDocRelateRes> searchRelates(UserPrincipal user, Long corpDocId) {
        return mapper.selectRelatesByCorpDocId(user.getCompanyId(), corpDocId);
    }

    /**
     * AS-IS Apr18_RelateCorpDoc.modelUpdate L34-60 — "하나의 상신문서는 여러개의 신청내역을 가질 수 없다": 이미 어떤 신청내역에 연결된 상신문서면 "이미 연결된 문서입니다."
     * (AS-IS는 같은 신청내역이면 통과시키려고 `checkList.get(0) != corpDocId`를 썼지만 Long 객체 비교라 큰 번호에서는 늘 참 — 관찰되는 동작대로 하나라도 연결돼 있으면 거절한다)
     */
    @Transactional
    public void insertRelate(UserPrincipal user, Long corpDocId, Long apprId) {
        if (apprId == null || mapper.countCorpDoc(user.getCompanyId(), corpDocId) == 0) throw new BusinessException(ErrorCode.INVALID_INPUT);
        if (!mapper.selectCorpDocIdsByApprId(apprId).isEmpty()) throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 연결된 문서입니다.");
        mapper.insertRelate(mapper.selectNextId(), corpDocId, apprId);
    }

    /** AS-IS Apr18_RelateCorpDoc.delete L67-70 */
    @Transactional
    public void deleteRelates(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        mapper.deleteRelates(user.getCompanyId(), ids);
    }
}
