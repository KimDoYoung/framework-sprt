package kr.co.kfs.asseterp.biz.opr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.opr.dto.OprCreateRes;
import kr.co.kfs.asseterp.biz.opr.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.opr.mapper.OprFundLookupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import kr.co.kfs.asseterp.common.util.Texts;

/** 펀드찾기 창 (AS-IS server/opr/Opr01_Create.selectByLookupTitle · Opr02_Fund.selectByCreateId) — EE100 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class OprFundLookupService {

    private final OprFundLookupMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** 제목+작성자 이름에 `%검색어%`, 년도에 `%년도%`(AS-IS 화면이 `%`를 붙이던 것 — 빈 값이면 전체) */
    public List<OprCreateRes> searchCreates(UserPrincipal user, String title, String year) {
        return mapper.selectByLookupTitle(user.getCompanyId(), Texts.like(title), Texts.like(year));
    }

    /** 내 조직(LoginUser.getOrgCodeId — 회사관리자(userId < 0)는 0)이 권한을 가진 연관펀드만 */
    public List<OprFundRes> searchFunds(UserPrincipal user, Long createId) {
        Long orgId = user.getUserId() < 0 ? Long.valueOf(0L) : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectFundsByCreateId(user.getCompanyId(), createId, orgId);
    }
}
