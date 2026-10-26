package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundLookupRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndFundMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/fnd/Fnd00_Fund.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndFundService {

    private final FndFundMapper mapper;

    /** AS-IS fnd.Fnd00_Fund.selectByLookupFundCode L100 (P01 펀드찾기). 검색어는 클라이언트가 %…%로 만든다 → 서버가 감싼다 */
    public List<FundLookupRes> searchLookup(UserPrincipal user, boolean closeYn, String fundName) {
        return mapper.selectByLookupFundCode(user.getCompanyId(), String.valueOf(closeYn), "%" + (fundName == null ? "" : fundName) + "%");
    }
}
