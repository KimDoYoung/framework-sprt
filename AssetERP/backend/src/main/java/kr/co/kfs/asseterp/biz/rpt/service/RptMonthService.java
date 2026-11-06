package kr.co.kfs.asseterp.biz.rpt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.MonthPrintReq;
import kr.co.kfs.asseterp.biz.rpt.dto.MonthRes;
import kr.co.kfs.asseterp.biz.rpt.dto.MonthSaveReq;
import kr.co.kfs.asseterp.biz.rpt.mapper.RptMonthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import kr.co.kfs.asseterp.common.util.Texts;

/** AS-IS server/rpt/Rpt02_Month.java (Z10 월간회의자료) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RptMonthService {

    /** AS-IS Rpt02_Tab_MonthWrite.settings — [출력/다운로드]의 windowClassName */
    private static final String WINDOW = "Rpt02_Tab_MonthWrite";

    private final RptMonthMapper mapper;

    /** AS-IS selectByText L23 — 회사 전체 글. yyyyMm = "yyyy.MM" 또는 "yyyy.%", 검색어는 '%…%' (retrieve L266-279) */
    public List<MonthRes> searchByText(UserPrincipal user, String yyyyMm, Long orgCodeId, String searchText) {
        return mapper.selectByText(user.getCompanyId(), yyyyMm, orgCodeId, Texts.like(searchText));
    }

    /**
     * AS-IS modelUpdate L32 — ID가 없으면 getSeq로 채번해 INSERT(회사·사원 = 로그인 값), 있으면 UPDATE. 저장한 행을 다시 읽어 돌려준다.
     * 수정 창은 본인 글일 때만 [저장]이 보인다(Rpt02_Edit_MonthWrite.edit L79-93) → 서버도 본인 글만 고친다.
     */
    @Transactional
    public MonthRes save(UserPrincipal user, MonthSaveReq req) {
        // Rpt02_Edit_MonthWrite.update L161-181
        if (req.yyyyMm() == null || req.yyyyMm().length() < 4) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년도를 확인하여 주십시오");
        }
        if (req.yyyyMm().length() < 7) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준월은 필수선택 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "업무내용은 필수작성 항목입니다");
        }
        Long id = req.monthId();
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertMonth(user.getCompanyId(), user.getUserId(), id, req);
        } else if (mapper.updateMonth(user.getCompanyId(), user.getUserId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS delete L50 — 체크한 행을 지운다(확인창은 화면). 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            count += mapper.deleteMonth(user.getCompanyId(), user.getUserId(), id);
        }
        return count;
    }

    /** AS-IS sys.Sys99_Print.insertRdMonth L1318 — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId) */
    @Transactional
    public String insertRdMonth(UserPrincipal user, MonthPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW);
        for (MonthRes row : mapper.selectByText(user.getCompanyId(), req.yyyyMm(), req.orgCodeId(), Texts.like(req.searchText()))) {
            mapper.insertPrint(mapper.selectNextId(), user.getCompanyId(), user.getUserId(), WINDOW, groupId, row);
        }
        return String.valueOf(groupId);
    }
}
