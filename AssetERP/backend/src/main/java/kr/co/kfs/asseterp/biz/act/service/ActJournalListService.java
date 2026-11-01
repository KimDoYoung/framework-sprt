package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.JournalRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalEditMapper;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalListMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/act/Act02_Journal.java (selectByDate L37 · selectById L31 · delete L647) — 전표입력 Act02_Tab_CreateJournal · 전표 조회창 Act02_Lookup_JournalList (X01) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalListService {

    private final ActJournalListMapper mapper;
    private final ActJournalEditMapper editMapper;

    /** abroType 1:국내/2:국외. searchText는 거래처/적요 글자(서버가 %…%) */
    public List<JournalRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String abroType, String searchText) {
        String text = searchText == null || searchText.isBlank() ? "%" : "%" + searchText + "%";
        return mapper.selectByDate(user.getCompanyId(), startDate, closeDate, abroType, text);
    }

    public JournalRes get(UserPrincipal user, Long journalId) {
        JournalRes r = mapper.selectById(user.getCompanyId(), journalId);
        if (r == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return r;
    }

    /** Act02_Journal.delete — 연관문서(act80)·임시분개(act06)·분개장(act03)을 지운 뒤 전표(act02)를 지운다. 내 회사 전표만 */
    @Transactional
    public void delete(UserPrincipal user, List<Long> journalIds) {
        for (Long journalId : journalIds) {
            if (mapper.selectById(user.getCompanyId(), journalId) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            mapper.deleteRelateApprByJournalId(journalId);
            editMapper.deleteTmpByJournalId(journalId);
            editMapper.deleteDtlByJournalId(journalId);
            mapper.deleteJournal(journalId);
        }
    }
}
