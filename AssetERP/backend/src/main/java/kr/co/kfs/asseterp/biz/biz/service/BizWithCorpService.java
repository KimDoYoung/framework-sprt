package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizWithCorpRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizWithCorpMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Biz13_Lookup_WithCorp(EE16) → server/biz/Biz13_WithCorp.selectByText (L31) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizWithCorpService {

    private final BizWithCorpMapper mapper;

    public List<BizWithCorpRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }
}
