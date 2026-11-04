package kr.co.kfs.asseterp.biz.crm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmShareRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmShareSaveReq;
import kr.co.kfs.asseterp.biz.crm.mapper.CrmShareMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 영업거래처 기본공유(AS-IS server/crm/Crm14_ShareDefault)·업무활동 공유(Crm15_Share) 창 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CrmShareService {

    private final CrmShareMapper mapper;

    /** AS-IS Crm14_ShareDefault.selectByContactId */
    public List<CrmShareRes> searchDefault(UserPrincipal user, Long contactId) {
        return mapper.selectDefaultByContactId(user.getCompanyId(), contactId);
    }

    /** AS-IS Crm14_Lookup_ShareDefault.update L240-275 + updateEnd L277-300 — 지운 줄(delete) 뒤 새 줄(update), 저장 뒤 공유 문구 */
    @Transactional
    public String saveDefault(UserPrincipal user, Long contactId, CrmShareSaveReq req) {
        if (mapper.countContact(user.getCompanyId(), contactId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.deleteDefault(user.getCompanyId(), contactId, req.deleteIds());
        }
        if (req.rows() != null) {
            for (CrmShareSaveReq.Row r : req.rows()) {
                mapper.insertDefault(mapper.selectNextId(), user.getCompanyId(), contactId, r.shareCode(), r.personId(), r.orgId());
            }
        }
        String info = mapper.selectDefaultShareInfo(contactId);
        return info == null ? "" : info;
    }

    /** AS-IS Crm15_Share.selectByWorkDetailId */
    public List<CrmShareRes> searchByWorkDetail(UserPrincipal user, Long workDetailId) {
        return mapper.selectByWorkDetailId(user.getCompanyId(), workDetailId);
    }

    /** AS-IS Crm15_Lookup_Share.update — 지운 줄 뒤 새 줄, 저장 뒤 공유 문구 */
    @Transactional
    public String saveByWorkDetail(UserPrincipal user, Long workDetailId, CrmShareSaveReq req) {
        // 새 건(NEW)은 업무활동 행이 저장 전이라 존재 검사를 하지 않는다 — 줄은 로그인 회사 번호로만 넣고 지운다
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.deleteShares(user.getCompanyId(), workDetailId, req.deleteIds());
        }
        if (req.rows() != null) {
            for (CrmShareSaveReq.Row r : req.rows()) {
                mapper.insertShare(mapper.selectNextId(), user.getCompanyId(), workDetailId, r.shareCode(), r.personId(), r.orgId());
            }
        }
        String info = mapper.selectShareInfo(workDetailId);
        return info == null ? "" : info;
    }
}
