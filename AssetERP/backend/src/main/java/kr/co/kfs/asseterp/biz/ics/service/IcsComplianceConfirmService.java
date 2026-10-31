package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriterRes;
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
                                                   Long writerId, int offset, int limit) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        // V28: 원본(10-29)은 내가 확인자인(confirmerId = 로그인 사원) 작성 내역만 읽고, 사원명 조회(writerId)는 목록에만 건다 — 전체 건수는 사원 조건 없이 센다
        return new PageRes<>(mapper.selectTotal(user.getCompanyId(), stdDate, like, checkBox, cycleType, user.getUserId()),
                mapper.selectPaging(user.getCompanyId(), stdDate, like, checkBox, cycleType, user.getUserId(), writerId, offset, limit));
    }

    /** AS-IS Ics30_Compliance.getConfirmYn: 내가 확인할 미확인 건수 (> 0이면 [상신]이 "미확인 건이 존재합니다.") */
    public long unconfirmedCount(UserPrincipal user, LocalDate stdDate, String cycleType) {
        return mapper.selectUnconfirmedCount(user.getCompanyId(), stdDate, "%", false, cycleType, user.getUserId());
    }

    /** AS-IS Ics30_Compliance.selectWriterId: 사원명 조회창의 목록 */
    public List<IcsComplianceWriterRes> writers(UserPrincipal user, LocalDate stdDate, String searchText, String cycleType) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectWriters(user.getCompanyId(), stdDate, like, cycleType, user.getUserId());
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
