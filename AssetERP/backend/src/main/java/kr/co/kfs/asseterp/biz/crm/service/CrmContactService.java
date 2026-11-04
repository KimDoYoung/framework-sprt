package kr.co.kfs.asseterp.biz.crm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactDetailRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactSaveReq;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.biz.crm.mapper.CrmContactMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CrmContactService {

    private final CrmContactMapper mapper;

    /** AS-IS crm.Crm09_Contact.selectKeyInCompanyName — 검색어는 `%…%`(대소문자 무시) */
    public List<CrmContactRes> searchKeyInCompanies(UserPrincipal user, String searchText) {
        return mapper.selectKeyInCompanyName(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS crm09_contact.selectById (Crm09_Lookup_ContactPoint.openEdit) */
    public CrmContactDetailRes get(UserPrincipal user, Long contactId) {
        CrmContactDetailRes res = mapper.selectById(user.getCompanyId(), contactId);
        if (res == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return res;
    }

    /** AS-IS Crm09_Contact.modelUpdate L103-114 — 번호가 없으면 새 번호로 INSERT, 있으면 UPDATE. 저장한 한 건을 다시 읽어 준다 */
    @Transactional
    public CrmContactDetailRes save(UserPrincipal user, CrmContactSaveReq req) {
        Long contactId = req.contactId();
        if (contactId == null) {
            contactId = mapper.selectNextId();
            mapper.insert(contactId, user.getCompanyId(), user.getUserId(), req);
        } else if (mapper.update(user.getCompanyId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return get(user, contactId);
    }
}
