package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktSelectRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetItemRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetRes;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktTargetCompanyMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.kfs.asseterp.common.util.Texts;

/** AS-IS Mkt01_Lookup_Select2 → server/mkt/Mkt01_TargetCompany.java (selectTargetCompanyPaging L40 / selectManagerPaging L46) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktTargetCompanyService {

    private final MktTargetCompanyMapper mapper;

    /** AS-IS mkt.Mkt01_TargetCompany.selectTargetCompanyPaging — 회사별(`cmp`) */
    public PageRes<MktTargetRes> searchCompanies(UserPrincipal user, String searchText, long offset, long limit) {
        String text = Texts.like(searchText);
        return new PageRes<>(mapper.selectTargetCompanyTotal(user.getCompanyId(), text),
                mapper.selectTargetCompanyPaging(user.getCompanyId(), text, offset, limit));
    }

    /** Z06 AS-IS mkt.Mkt01_TargetCompany.selectTargetCompanyPaging — 구분(`%` 전체) 조건이 있는 활동처 조회창 */
    public PageRes<MktTargetItemRes> searchByItemType(UserPrincipal user, String itemTypeCode, String searchText, long offset, long limit) {
        String text = Texts.like(searchText);
        String type = itemTypeCode == null || itemTypeCode.isEmpty() ? "%" : itemTypeCode;
        return new PageRes<>(mapper.selectTargetCompanyItemTotal(user.getCompanyId(), type, text),
                mapper.selectTargetCompanyItemPaging(user.getCompanyId(), type, text, offset, limit));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectManagerPaging — 직원별(`emp`) */
    public PageRes<MktTargetRes> searchManagers(UserPrincipal user, String searchText, long offset, long limit) {
        String text = Texts.like(searchText);
        return new PageRes<>(mapper.selectManagerTotal(user.getCompanyId(), text),
                mapper.selectManagerPaging(user.getCompanyId(), text, offset, limit));
    }

    /** Y12 AS-IS mkt.Mkt01_TargetCompany.selectBySearchTextPaging (Mkt01_Lookup_Select) — 구분 전체(`%`) */
    public PageRes<MktSelectRes> searchSelect(UserPrincipal user, String searchText, boolean favoriteYn, long offset, long limit) {
        String text = Texts.like(searchText);
        return new PageRes<>(mapper.selectSelectTotal(user.getCompanyId(), "%", text),
                mapper.selectSelectPaging(user.getCompanyId(), user.getUserId(), "%", text, favoriteYn, offset, limit));
    }
}
