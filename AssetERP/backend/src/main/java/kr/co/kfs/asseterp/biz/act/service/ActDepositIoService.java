package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.DepositIoPrintReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActDepositIoMapper;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalDtlMapper;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys99_Print.java insertRdDepositIoList L708-857 — 일일자금관리 RD 출력 자료(U01) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActDepositIoService {

    private static final String WINDOW = "Act02_Tab_DepositIoList";

    private final ActDepositIoMapper mapper;
    private final ActJournalDtlMapper journalMapper;

    /**
     * ① 내 출력 자료를 지운다 ② 예금원장 행마다 입금 줄(drSeq)을 넣고, 출금 줄은 입금 줄이 남아 있으면 같은 줄에 채우고(update) 모자라면 새 줄로 넣는다
     * ③ 입금·출금이 모두 없으면 원장 줄 하나(seq2 = 0). 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId)
     */
    @Transactional
    public String insertRdDepositIoList(UserPrincipal user, DepositIoPrintReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();

        mapper.deletePrint(companyId, personId, WINDOW);

        int seq = 0;
        for (BookRes book : req.rows()) {
            seq++;
            int drSeq = 0;
            int crSeq = 0;

            List<JournalDtlRes> inList = journalMapper.selectByAstId(companyId, book.holdDate(), book.astClassTreeId(), "D");
            for (JournalDtlRes in : inList) {
                drSeq++;
                mapper.insertPrint(mapper.selectNextId(), companyId, personId, WINDOW, groupId, seq, drSeq, book, in, null);
            }

            List<JournalDtlRes> outList = journalMapper.selectByAstId(companyId, book.holdDate(), book.astClassTreeId(), "C");
            for (JournalDtlRes out : outList) {
                crSeq++;
                if (drSeq < crSeq) {
                    mapper.insertPrint(mapper.selectNextId(), companyId, personId, WINDOW, groupId, seq, crSeq, book, null, out);
                } else {
                    mapper.updateOutData(groupId, seq, crSeq, out);
                }
            }

            if (drSeq == 0 && crSeq == 0) {
                mapper.insertPrint(mapper.selectNextId(), companyId, personId, WINDOW, groupId, seq, 0, book, null, null);
            }
        }
        return String.valueOf(groupId);
    }
}
