package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsComplianceConfirmMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Ics31_Tab_ComplianceConfirm → server/ics/Ics30_Compliance.selectByPaging L54 + Ics31_ComplianceWrite.updateConfirmYn L112 — K02 내부통제 준수점검(준감인).
 * stdDate = 기준 분기(월)의 말일. 확인자는 로그인 사용자
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsComplianceConfirmService {

    private final IcsComplianceConfirmMapper mapper;

    /** AS-IS selectByPaging: 목록 + 전체 건수. 검색어는 AS-IS처럼 앞뒤에 %를 붙인다 */
    public PageRes<IcsComplianceConfirmRes> search(UserPrincipal user, LocalDate stdDate, String searchText, boolean checkBox, String cycleType,
                                                   int offset, int limit) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return new PageRes<>(mapper.selectTotal(user.getCompanyId(), stdDate, like, checkBox, cycleType),
                mapper.selectPaging(user.getCompanyId(), stdDate, like, checkBox, cycleType, offset, limit));
    }

    /** AS-IS updateConfirmYn: 고른 작성 행을 확인('true')·확인취소('false') */
    @Transactional
    public int updateConfirmYn(UserPrincipal user, IcsComplianceConfirmReq req) {
        String confirmYn = Boolean.TRUE.equals(req.confirmYn()) ? "true" : "false";
        int count = 0;
        for (Long id : req.writeIds() == null ? List.<Long>of() : req.writeIds()) {
            count += mapper.updateConfirmYn(user.getCompanyId(), id, user.getUserId(), confirmYn);
        }
        return count;
    }
}
