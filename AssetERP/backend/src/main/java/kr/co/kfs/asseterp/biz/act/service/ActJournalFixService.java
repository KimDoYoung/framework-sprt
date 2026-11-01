package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.JournalFixRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalFixMapper;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** AS-IS server/act/Act02_Journal.java (selectByDateAll L43 · selectById L31 · updateFixYn L597) — 전표승인처리 Act02_Tab_JournalFix (X02) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalFixService {

    private final ActJournalFixMapper mapper;
    private final ActJournalMapper journalMapper;

    /** 검색어·거래처·거래유형·발생구분이 비면 '%'. unFixYn이 true면 미승인 전표만 */
    public List<JournalFixRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText, Long corpId,
                                      String trCode, boolean unFixYn, String trOccType) {
        return mapper.selectByDateAll(user.getCompanyId(), startDate, closeDate,
                searchText == null || searchText.isEmpty() ? "%" : searchText,
                corpId == null ? "%" : String.valueOf(corpId),
                trCode == null || trCode.isEmpty() ? "%" : trCode,
                String.valueOf(unFixYn),
                trOccType == null || trOccType.isEmpty() ? "%" : trOccType);
    }

    public JournalFixRes get(UserPrincipal user, Long journalId) {
        JournalFixRes r = mapper.selectById(user.getCompanyId(), journalId);
        if (r == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return r;
    }

    /**
     * updateFixYn — 전표마다 처리일 이후 마감·처리일 마감을 검사하고(걸리면 전부 취소) 승인(P)/승인취소(C)한 뒤, 바뀐 전표를 다시 읽어 돌려준다.
     * AS-IS는 화면이 보낸 전표의 회사·일자를 믿지만 TOBE는 내 회사 전표만 DB 값으로 검사한다
     */
    @Transactional
    public List<JournalFixRes> updateFixYn(UserPrincipal user, String procType, List<Long> journalIds) {
        List<JournalFixRes> result = new ArrayList<>();
        for (Long journalId : journalIds) {
            JournalFixRes j = get(user, journalId);
            if (journalMapper.countCloseAfter(user.getCompanyId(), j.date()) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "처리일(" + j.date() + ") 이후의  회계마감 내역이 존재합니다.");
            }
            if (journalMapper.countCloseOn(user.getCompanyId(), j.date()) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 회계마감이 완료되었습니다. (체크일:" + j.date() + ")");
            }
            mapper.updateFixYn(journalId, procType, user.getName());
            result.add(get(user, journalId));
        }
        return result;
    }
}
