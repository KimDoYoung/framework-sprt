package kr.co.kfs.asseterp.biz.crm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactRes;
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
}
