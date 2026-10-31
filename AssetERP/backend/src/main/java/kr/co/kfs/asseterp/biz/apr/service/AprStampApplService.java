package kr.co.kfs.asseterp.biz.apr.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplAddReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplEditRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplMeta;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprDetailMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprStampApplMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * 상신 문서창 날인신청 탭 (AS-IS client/vi/apr/Apr16_Grid_StampDoc · Apr16_Grid_StampApplList · Apr16_Lookup_StampApplQty, server Apr16_StampDoc, V14).
 * AS-IS도 [+]로 줄을 더하면 그 자리에서 apr16_stamp_doc에 넣고 [-]도 그 자리에서 지운다(문서가 아직 저장 전이어도). 제공처·제공목적·비고는 [저장]·[결재요청]이 `updateByApprId`로 쓴다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprStampApplService {

    private final AprStampApplMapper mapper;
    private final AprApprDetailMapper detailMapper;
    private final AprApprWriteMapper writeMapper;
    private final AprApprDetailService detailService;

    /** retrieve L254-275 + chkYn L277-297 */
    public AprStampApplEditRes get(UserPrincipal user, Long apprId) {
        if (writeMapper.selectBrief(apprId, user.getCompanyId()) != null) {
            detailService.getDetail(user, apprId);
        }
        AprStampApplMeta meta = mapper.selectMeta(apprId);
        return new AprStampApplEditRes(detailMapper.selectStampAppls(apprId), meta == null ? new AprStampApplMeta(null, null, null) : meta, locked(user, apprId));
    }

    /** Apr16_Lookup_StampApplQty.update L146-181 → apr.Apr16_StampDoc.modelUpdate */
    @Transactional
    public Long add(UserPrincipal user, Long apprId, AprStampApplAddReq req) {
        requireOpen(user, apprId);
        String type = req.applType();
        if (!"1".equals(type) && !"2".equals(type) && !"3".equals(type)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        if (req.stampReprCorpId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "2".equals(type) ? "대표명의를 선택해주세요" : "인감을 선택해주세요");
        }
        if (req.qty() == null || req.qty() == 0L) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "3".equals(type) ? "날인부수를 입력해주세요" : "신청매수를 입력해주세요");
        }
        Long id = mapper.selectNextId();
        boolean stamp = "3".equals(type);
        mapper.insertStampDoc(id, user.getCompanyId(), user.getUserId(), apprId, type,
                "2".equals(type) ? null : req.stampReprCorpId(), "2".equals(type) ? req.stampReprCorpId() : null,
                stamp ? null : req.qty(), stamp ? req.qty() : null, stamp ? String.valueOf(Boolean.TRUE.equals(req.outYn())) : null);
        return id;
    }

    /** Apr16_Grid_StampApplList.deleteRow L87-98 → apr.Apr16_StampDoc.delete */
    @Transactional
    public void delete(UserPrincipal user, Long apprId, Long stampDocId) {
        requireOpen(user, apprId);
        mapper.deleteStampDoc(apprId, user.getCompanyId(), stampDocId);
    }

    /** 결재한 사람이 있으면 [+]·[-]가 꺼진다(chkYn). 상태는 새 문서(행 없음)·결재요청 전(10)·임시저장(99)만 열린다 */
    private boolean locked(UserPrincipal user, Long apprId) {
        if (mapper.countApprovedSteps(apprId) > 0) {
            return true;
        }
        AprApprBrief doc = writeMapper.selectBrief(apprId, user.getCompanyId());
        return doc != null && !("10".equals(doc.statusCode()) || "99".equals(doc.statusCode()));
    }

    private void requireOpen(UserPrincipal user, Long apprId) {
        AprApprBrief doc = writeMapper.selectBrief(apprId, user.getCompanyId());
        if (doc != null && !user.getUserId().equals(doc.regEmpId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (locked(user, apprId)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "날인신청을 바꿀 수 없는 문서입니다");
        }
    }
}
