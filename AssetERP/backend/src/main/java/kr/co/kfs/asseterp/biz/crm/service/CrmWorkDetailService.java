package kr.co.kfs.asseterp.biz.crm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmRelateFundRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmWorkDetailRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmWorkDetailSaveReq;
import kr.co.kfs.asseterp.biz.crm.mapper.CrmWorkDetailMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 업무활동내역 창 (AS-IS server/crm/Crm12_WorkDetail · Crm13_RelateFund · Crm15_Share) */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CrmWorkDetailService {

    private final CrmWorkDetailMapper mapper;

    /** AS-IS DBUtil.setSeq — 새 건 번호 (f_create_seq()가 번호표를 갱신하므로 쓰기 트랜잭션) */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS crm12_work_detail.selectById (Crm12_Lookup_WorkDetail.edit/open) */
    public CrmWorkDetailRes get(UserPrincipal user, Long workDetailId) {
        CrmWorkDetailRes res = mapper.selectById(user.getCompanyId(), workDetailId);
        if (res == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return res;
    }

    /** AS-IS crm13_relate_fund.selectByWorkDetailId (retrieve01) */
    public List<CrmRelateFundRes> searchFunds(Long workDetailId) {
        return mapper.selectFundsByWorkDetailId(workDetailId);
    }

    /** AS-IS Crm15_Share.insertDefaultShare L30-37 — 복사된 것이 있으면 공유 요약을 돌려준다(없으면 null) */
    @Transactional
    public String insertDefaultShare(Long workDetailId, Long contactId) {
        int cnt = mapper.insertDefaultShare(contactId, workDetailId);
        return cnt > 0 ? mapper.selectShareInfo(workDetailId) : null;
    }

    /** AS-IS Crm15_Share.deleteDefaultShare L39-42 (등록 취소) */
    @Transactional
    public void deleteDefaultShare(Long workDetailId) {
        mapper.deleteSharesByWorkDetailId(workDetailId);
    }

    /**
     * AS-IS Crm12_WorkDetail.modelUpdate L58-75 + (연결펀드가 있으면) Crm13_RelateFund.updateList L30-35.
     * 새 건(번호가 아직 없는 행)은 INSERT, 있으면 UPDATE — 이미 있는 건을 비공개로 저장하면 공유를 지운다
     */
    @Transactional
    public void save(UserPrincipal user, CrmWorkDetailSaveReq req) {
        if (req == null || req.workDetailId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        boolean exists = mapper.countById(user.getCompanyId(), req.workDetailId()) > 0;
        if (exists) {
            if (req.privateYn()) mapper.deleteSharesByWorkDetailId(req.workDetailId());
            mapper.update(user.getCompanyId(), req);
        } else {
            mapper.insert(user.getCompanyId(), user.getUserId(), req);
        }
        if (req.fundIds() != null && !req.fundIds().isEmpty()) {
            mapper.deleteFundsByWorkDetailId(req.workDetailId());
            for (Long fundId : req.fundIds()) {
                mapper.insertFund(mapper.selectNextId(), req.workDetailId(), fundId);
            }
        }
    }

    /** AS-IS GridDeleteData crm.Crm13_RelateFund.delete (연결펀드 그리드 삭제 아이콘) */
    @Transactional
    public void deleteFund(UserPrincipal user, Long relateFundId) {
        mapper.deleteFund(relateFundId, user.getCompanyId());
    }
}
