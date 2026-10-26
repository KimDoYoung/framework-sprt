package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fnd.dto.FundLookupRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundMultiRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSingleRes;
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
    private final EmpTransInfoService transInfoService;

    /** AS-IS fnd.Fnd00_Fund.selectByLookupFundCode L100 (P01 펀드찾기). 검색어는 클라이언트가 %…%로 만든다 → 서버가 감싼다 */
    public List<FundLookupRes> searchLookup(UserPrincipal user, boolean closeYn, String fundName) {
        return mapper.selectByLookupFundCode(user.getCompanyId(), String.valueOf(closeYn), "%" + (fundName == null ? "" : fundName) + "%");
    }

    /**
     * AS-IS fnd.Fnd00_Fund.selectBySearchText L32 → orgId가 없으면(openAdmin) selectBySearchTextAdmin (P06 연관펀드 조회창).
     * 검색어는 서버가 %…%로, 펀드유형은 비면 %. 해지펀드포함이 아니면 closeYn은 'false'
     */
    public List<FundMultiRes> searchMultiAdmin(UserPrincipal user, boolean planYn, String fundType, String searchText,
                                               boolean closeYn, boolean classYn) {
        return mapper.selectBySearchTextAdmin(user.getCompanyId(), String.valueOf(closeYn), String.valueOf(planYn),
                fundType == null || fundType.isBlank() ? "%" : fundType, "%" + (searchText == null ? "" : searchText) + "%",
                String.valueOf(classYn));
    }

    /**
     * AS-IS fnd.Fnd00_Fund.selectBySearchText L32 (orgId가 있으면) — P12 연관펀드 단일 선택 조회창.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 (P09와 같음). 검색어는 서버가 %…%로, 펀드유형은 비면 %
     */
    public List<FundSingleRes> searchSingle(UserPrincipal user, boolean planYn, String fundType, String searchText, boolean closeYn, boolean classYn) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectBySearchText(user.getCompanyId(), orgId, String.valueOf(closeYn), String.valueOf(planYn),
                fundType == null || fundType.isBlank() ? "%" : fundType, "%" + (searchText == null ? "" : searchText) + "%",
                String.valueOf(classYn));
    }
}
