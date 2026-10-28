package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateNoteRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateNoteSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRelateNoteMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/Pay09_RelateNote.java (selectByCompanyId L27 / checkNote L34 / modelUpdate L68 / update L81 / delete L86) — 급여 비고 (S16) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRelateNoteService {

    private final PayRelateNoteMapper mapper;

    /** pay09_relate_note.selectByCompanyId */
    public List<PayRelateNoteRes> search(UserPrincipal user, String payCode, LocalDate payDate, String noteType) {
        return mapper.selectByCompanyId(user.getCompanyId(), payCode, payDate, noteType);
    }

    /** AS-IS checkNote: 있으면 그 행, 없으면 빈 비고 행을 만들어 돌려준다 */
    @Transactional
    public PayRelateNoteRes check(UserPrincipal user, String payCode, LocalDate payDate, String noteType) {
        Long companyId = user.getCompanyId();
        List<PayRelateNoteRes> list = mapper.selectByCompanyId(companyId, payCode, payDate, noteType);
        if (!list.isEmpty()) {
            return list.get(0);
        }
        long id = mapper.selectNextId();
        mapper.insert(id, companyId, new PayRelateNoteSaveReq(id, payDate, payCode, noteType, null, null));
        return mapper.selectById(companyId, id);
    }

    /** AS-IS modelUpdate / update (UpdateDataModel) → 저장된 행(요청 순서) */
    @Transactional
    public List<PayRelateNoteRes> save(UserPrincipal user, List<PayRelateNoteSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (PayRelateNoteSaveReq req : rows) {
            if (req.personId() != null && mapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.stream().map(req -> {
            if (req.relateNoteId() != null && mapper.selectById(companyId, req.relateNoteId()) != null) {
                mapper.update(companyId, req);
                return mapper.selectById(companyId, req.relateNoteId());
            }
            long id = mapper.selectNextId();
            mapper.insert(id, companyId, req);
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS delete → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
