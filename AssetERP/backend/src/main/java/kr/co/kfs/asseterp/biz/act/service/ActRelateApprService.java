package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.ActRelateApprAddReq;
import kr.co.kfs.asseterp.biz.act.dto.ActRelateApprRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActRelateApprMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/act/Act80_RelateAppr.java (selectByJournalId L25 · selectByTrId L33 · modelUpdate L41 · delete L66) · Act02_Journal.selectOneJournalIdByTrId L61 — 연관문서 Act80_Lookup_RelateAppr (W05 2단계 ⓑ) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActRelateApprService {

    private final ActRelateApprMapper mapper;

    /** code = "trId" → selectByTrId, "journalId" → selectByJournalId (AS-IS retrieve() L194-206, 다른 code면 아무것도 읽지 않는다) */
    public List<ActRelateApprRes> search(UserPrincipal user, String code, Long relateId) {
        if ("trId".equals(code)) return mapper.selectByTrId(user.getCompanyId(), relateId);
        if ("journalId".equals(code)) return mapper.selectByJournalId(user.getCompanyId(), relateId);
        return List.of();
    }

    /** 거래에 걸린 전표 ID(첨부파일 부모) — 없으면 null */
    public Long getJournalIdByTr(Long trId) {
        return mapper.selectOneJournalIdByTrId(trId);
    }

    /** modelUpdate: trId가 없으면 전표에서, journalId가 없으면 거래에서 채워 한 줄을 넣는다 */
    @Transactional
    public void add(UserPrincipal user, ActRelateApprAddReq r) {
        if (mapper.countAppr(user.getCompanyId(), r.apprId()) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        Long trId = r.trId();
        Long journalId = r.journalId();
        if (trId == null && journalId != null) trId = mapper.selectTrId(journalId);
        if (journalId == null && trId != null) journalId = mapper.selectJournalId(trId);
        mapper.insertRelateAppr(mapper.selectNextId(), r.apprId(), journalId, trId);
    }

    @Transactional
    public void delete(UserPrincipal user, List<Long> relateApprIds) {
        for (Long id : relateApprIds) mapper.deleteRelateAppr(user.getCompanyId(), id);
    }
}
