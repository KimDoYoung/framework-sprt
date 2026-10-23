package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetRes;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktTargetCompanyMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS Mkt01_Lookup_Select2 → server/mkt/Mkt01_TargetCompany.java (selectTargetCompanyPaging L40 / selectManagerPaging L46) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktTargetCompanyService {

    private final MktTargetCompanyMapper mapper;

    /** AS-IS mkt.Mkt01_TargetCompany.selectTargetCompanyPaging — 회사별(`cmp`) */
    public PageRes<MktTargetRes> searchCompanies(UserPrincipal user, String searchText, long offset, long limit) {
        String text = like(searchText);
        return new PageRes<>(mapper.selectTargetCompanyTotal(user.getCompanyId(), text),
                mapper.selectTargetCompanyPaging(user.getCompanyId(), text, offset, limit));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectManagerPaging — 직원별(`emp`) */
    public PageRes<MktTargetRes> searchManagers(UserPrincipal user, String searchText, long offset, long limit) {
        String text = like(searchText);
        return new PageRes<>(mapper.selectManagerTotal(user.getCompanyId(), text),
                mapper.selectManagerPaging(user.getCompanyId(), text, offset, limit));
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }
}
