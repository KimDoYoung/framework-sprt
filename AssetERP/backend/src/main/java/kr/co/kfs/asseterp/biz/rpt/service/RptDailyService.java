package kr.co.kfs.asseterp.biz.rpt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailySaveReq;
import kr.co.kfs.asseterp.biz.rpt.mapper.RptDailyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/rpt/Rpt01_Daily.java (Z08 일일업무 입력) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RptDailyService {

    private final RptDailyMapper mapper;

    /** AS-IS selectByText L26 — 내 일일업무만, 검색어는 '%…%' (Rpt01_Tab_DailyWrite.retrieve L176-191) */
    public List<DailyRes> searchByText(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByText(user.getCompanyId(), user.getUserId(), startDate, closeDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS modelUpdate L54 — ID가 없으면 getSeq로 채번해 INSERT(회사·사원 = 로그인 값), 있으면 UPDATE 뒤 selectById로 다시 읽는다.
     * 수정 창은 확인된 글이면 일자·업무내용 칸을 잠근다(Rpt01_Edit_DailyWrite.edit L63-71) → 서버도 그 두 값은 원래 값을 쓴다.
     */
    @Transactional
    public DailyRes save(UserPrincipal user, DailySaveReq req) {
        // Rpt01_Edit_DailyWrite.update L136-143
        if (req.date() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "일자는 필수작성 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "업무내용은 필수작성 항목입니다");
        }
        Long id = req.dailyId();
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertDaily(user.getCompanyId(), user.getUserId(), id, req);
        } else {
            DailyRes old = mapper.selectById(user.getCompanyId(), id);
            if (old == null || !user.getUserId().equals(old.personId())) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            DailySaveReq use = Boolean.TRUE.equals(old.confirmYn()) ? new DailySaveReq(id, old.date(), old.content(), req.note()) : req;
            mapper.updateDaily(user.getCompanyId(), user.getUserId(), use);
        }
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS delete L105 + 화면 검사(Rpt01_Tab_DailyWrite.deleteRow L203-218): 확인처리된 글이 있으면 "이미 확인처리된 업무가 있습니다." */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            DailyRes row = mapper.selectById(user.getCompanyId(), id);
            if (row == null) {
                continue;
            }
            if (Boolean.TRUE.equals(row.confirmYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 확인처리된 업무가 있습니다.");
            }
            count += mapper.deleteDaily(user.getCompanyId(), user.getUserId(), id);
        }
        return count;
    }
}
