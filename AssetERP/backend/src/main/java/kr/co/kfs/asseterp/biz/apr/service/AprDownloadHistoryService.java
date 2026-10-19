package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprDownloadHistoryCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDownloadHistoryRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprDownloadHistoryMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/Apr40_DownloadHistory.java (F09 문서 다운로드·다운로드 기록) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprDownloadHistoryService {

    private final AprDownloadHistoryMapper mapper;

    /** AS-IS selectByTextPaging L37. 검색어는 서비스가 %…%로 만든다(빈 글자면 %%) */
    public PageRes<AprDownloadHistoryRes> searchByText(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText, long offset, long limit) {
        AprDownloadHistoryCond cond = new AprDownloadHistoryCond(user.getCompanyId(), startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%", limit, offset);
        return new PageRes<>(mapper.selectByTextPagingTotal(cond), mapper.selectByTextPaging(cond));
    }

    /** AS-IS updateList L52: 문서마다 기록 1건(회사·사원은 세션) */
    @Transactional
    public void createList(UserPrincipal user, List<Long> apprIds) {
        for (Long apprId : apprIds) {
            if (apprId != null) {
                mapper.insert(user.getCompanyId(), user.getUserId(), apprId);
            }
        }
    }
}
