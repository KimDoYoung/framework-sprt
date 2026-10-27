package kr.co.kfs.asseterp.biz.chk.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListConfirmReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListConfirmRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteAnswerReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteCreateReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteItem;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteRes;
import kr.co.kfs.asseterp.biz.chk.mapper.ChkDailyListMapper;
import kr.co.kfs.asseterp.biz.chk.mapper.ChkDailyListWriteMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Chk03_Tab_DailyListWrite·Chk03_Edit_Reason·Chk03_Edit_Note → server/chk/Chk03_DailyListWrite.java
 * (selectById L21 / updateAnswerCode L45 / modelUpdate L149) + Chk02_DailyList.selectByPersonId L65. 작성 행은 내 것만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChkDailyListWriteService {

    private final ChkDailyListMapper listMapper;
    private final ChkDailyListWriteMapper mapper;

    /** AS-IS Chk02_DailyList.selectByPersonId: 내가 속한 작성그룹의 점검내역 + 그 날짜의 내 작성 행 (searchText는 원본도 SQL이 쓰지 않는다) */
    public List<ChkDailyListWriteRes> list(UserPrincipal user, Long classTreeId, LocalDate date, boolean checkBox) {
        return listMapper.selectByPersonId(user.getCompanyId(), user.getUserId(), classTreeId, date, checkBox);
    }

    /** AS-IS Chk03_DailyListWrite.updateAnswerCode: 그 날짜 작성 행이 있으면 답변만 바꾸고, 없으면 새로 만든다 → 작성 행 */
    @Transactional
    public ChkDailyListWriteItem updateAnswerCode(UserPrincipal user, ChkDailyListWriteAnswerReq req) {
        ChkDailyListWriteItem found = mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), req.dailyListId(), req.date());
        if (found != null) {
            mapper.updateAnswerCode(user.getCompanyId(), user.getUserId(), found.dailyListWriteId(), req.answerCode(), req.date());
            return mapper.selectById(user.getCompanyId(), user.getUserId(), found.dailyListWriteId());
        }
        return insert(user, req.dailyListId(), req.date(), req.answerCode());
    }

    /** AS-IS Chk03_Tab_DailyListWrite.updateReasonNote: 작성 행이 없으면 답변 없이 먼저 만든다(modelUpdate) */
    @Transactional
    public ChkDailyListWriteItem create(UserPrincipal user, ChkDailyListWriteCreateReq req) {
        ChkDailyListWriteItem found = mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), req.dailyListId(), req.date());
        if (found != null) {
            return found;
        }
        return insert(user, req.dailyListId(), req.date(), null);
    }

    /** AS-IS Chk03_DailyListWrite.selectById — 편집 창을 열기 전 확인여부 검사·창에 보일 값 */
    public ChkDailyListWriteItem get(UserPrincipal user, Long dailyListWriteId) {
        return required(mapper.selectById(user.getCompanyId(), user.getUserId(), dailyListWriteId));
    }

    /** AS-IS Chk03_Edit_Reason.update → modelUpdate (점검결과) */
    @Transactional
    public ChkDailyListWriteItem updateReason(UserPrincipal user, Long dailyListWriteId, String reason) {
        required(mapper.selectById(user.getCompanyId(), user.getUserId(), dailyListWriteId));
        mapper.updateReason(user.getCompanyId(), user.getUserId(), dailyListWriteId, reason);
        return mapper.selectById(user.getCompanyId(), user.getUserId(), dailyListWriteId);
    }

    /** AS-IS Chk03_Edit_Note.update → modelUpdate (비고) */
    @Transactional
    public ChkDailyListWriteItem updateNote(UserPrincipal user, Long dailyListWriteId, String note) {
        required(mapper.selectById(user.getCompanyId(), user.getUserId(), dailyListWriteId));
        mapper.updateNote(user.getCompanyId(), user.getUserId(), dailyListWriteId, note);
        return mapper.selectById(user.getCompanyId(), user.getUserId(), dailyListWriteId);
    }

    /** AS-IS selectDailyListStatusPaging(+Total): 점검일의 담당자별 점검내역 중 내가 확인자인 행. 검색어는 "%…%"로 감싼다(GridPagingLoader 호출부) */
    public PageRes<ChkDailyListConfirmRes> searchConfirmList(UserPrincipal user, Long classTreeId, LocalDate date, String searchText,
                                                             boolean unCheckYn, boolean unConfirmYn, long offset, long limit) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        long total = listMapper.selectConfirmListTotal(user.getCompanyId(), user.getUserId(), classTreeId, date, like,
                String.valueOf(unCheckYn), String.valueOf(unConfirmYn));
        List<ChkDailyListConfirmRes> rows = listMapper.selectConfirmListPaging(user.getCompanyId(), user.getUserId(), classTreeId, date, like,
                String.valueOf(unCheckYn), String.valueOf(unConfirmYn), limit, offset);
        return new PageRes<>(total, rows);
    }

    /** AS-IS Chk03_DailyListWrite.updateConfirmYn: 대상마다 그 날짜 작성 행이 있으면 확인여부·확인자(취소면 null)를 바꾸고, 없으면 확인 정보만 가진 행을 만든다 */
    @Transactional
    public int updateConfirmYn(UserPrincipal user, ChkDailyListConfirmReq req) {
        String confirmYn = String.valueOf(req.confirmYn());
        Long confirmerId = req.confirmYn() ? user.getUserId() : null;
        int count = 0;
        for (ChkDailyListConfirmReq.Item item : req.items()) {
            ChkDailyListWriteItem found = mapper.selectByPersonId(user.getCompanyId(), item.personId(), item.dailyListId(), req.date());
            if (found != null) {
                mapper.updateConfirmYn(user.getCompanyId(), found.dailyListWriteId(), confirmYn, confirmerId);
            } else {
                mapper.insertConfirm(user.getCompanyId(), mapper.selectNextId(), item.dailyListId(), req.date(), item.personId(), confirmYn, user.getUserId());
            }
            count++;
        }
        return count;
    }

    private ChkDailyListWriteItem insert(UserPrincipal user, Long dailyListId, LocalDate date, String answerCode) {
        long id = mapper.selectNextId();
        mapper.insert(user.getCompanyId(), user.getUserId(), id, dailyListId, date, answerCode);
        return mapper.selectById(user.getCompanyId(), user.getUserId(), id);
    }

    private static ChkDailyListWriteItem required(ChkDailyListWriteItem item) {
        if (item == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return item;
    }
}
