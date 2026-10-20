package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionLawRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsRevisionHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ics/Ics20_RevisionHistory.java (selectByClassTreeId / updateContent) — Ics20_Lookup_RevisionHistory·Ics20_Lookup_Content */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsRevisionHistoryService {

    private final IcsRevisionHistoryMapper mapper;
    private final IcsRevisionHistoryAdminService adminService;

    /** AS-IS selectByClassTreeId: 법규에 연결된 개정내역을 등록일 내림차순으로 */
    public List<IcsRevisionHistoryRes> searchByClassTreeId(Long classTreeId) {
        return mapper.selectByClassTreeId(classTreeId);
    }

    /** AS-IS Ics20_Tab_RevisionHistory.retrieve → selectByDate: 관리자 화면(Ics20_Tab_RevisionHistoryAdmin)과 같은 SQL */
    public List<IcsRevisionHistoryAdminRes> searchByDate(LocalDate startDate, LocalDate closeDate, String financeAgencyCode,
                                                         String searchText, String relatedLawSearchText, String dateType) {
        return adminService.search(startDate, closeDate, financeAgencyCode, searchText, relatedLawSearchText, dateType);
    }

    /** AS-IS Ics20_Edit_RevisionHistory → ics19_Grid_IcsList.retrieve → Ics19_RevisionRelateIcs.selectByRevisionHistoryId */
    public List<IcsRevisionLawRes> searchLaws(Long revisionHistoryId) {
        return adminService.searchLaws(revisionHistoryId);
    }

    /** AS-IS updateContent: 개정내역 상세내용 저장(관리자 화면만 저장 버튼이 있다) */
    @Transactional
    public void updateContent(UserPrincipal user, Long revisionHistoryId, String content) {
        IcsClassTreeService.requireSysAdmin(user);
        if (mapper.updateContent(revisionHistoryId, content) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
