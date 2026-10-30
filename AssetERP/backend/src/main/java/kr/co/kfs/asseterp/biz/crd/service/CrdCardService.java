package kr.co.kfs.asseterp.biz.crd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardManagerRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardUserRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardUserSaveReq;
import kr.co.kfs.asseterp.biz.crd.mapper.CrdCardMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/crd/Crd01_Card.java (selectByText L27 / update L49 / delete L54) · Crd03_Trans.java (selectByCardId L27 / deleteByCardId L34 / update L43 / delete L48)
 * · Crd02_Data.selectByCardNo L26 · Sys00_Common.selectCardManager L86. 로그인 회사의 카드만 다룬다(crd03_trans에는 회사 열이 없어 카드로 확인한다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrdCardService {

    private final CrdCardMapper mapper;

    /** crd01_card.selectByText — 검색어는 서버가 "%…%"로 감싼다 */
    public List<CrdCardRes> search(UserPrincipal user, String searchText, boolean useYn, Long managerId) {
        return mapper.selectByText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%", useYn, managerId);
    }

    /** sys00_common.selectCardManager */
    public List<CrdCardManagerRes> managers(UserPrincipal user, boolean useYn) {
        return mapper.selectManagers(user.getCompanyId(), useYn);
    }

    /**
     * Crd01_Edit_Card.updateCheck L199-227 + update L229 — 카드번호 20자 초과 막기, 사용내역이 있는 카드는 식별구분(cardNo) 수정 불가.
     * cardId가 없거나 0 이하면 새 카드. 저장한 카드를 다시 읽어 돌려준다
     */
    @Transactional
    public CrdCardRes saveCard(UserPrincipal user, CrdCardSaveReq in) {
        if (in.cardNoSlip() != null && in.cardNoSlip().length() > 20) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "카드번호를 다시 확인 바랍니다.");
        }
        CrdCardSaveReq req = new CrdCardSaveReq(in.cardId(), in.bankCode(), in.cardName(), in.cardNoSlip(), in.cardNo(), in.frDate(),
                in.toDate(), "true".equals(in.closeYn()) ? "true" : "false", in.cardType(), in.note(), in.depositId());
        boolean exists = in.cardId() != null && in.cardId() > 0;
        if (exists) {
            CrdCardRes old = mapper.selectById(user.getCompanyId(), in.cardId());
            if (old == null) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            if (old.cardNo() != null && mapper.countDataByCardNo(user.getCompanyId(), old.cardNo()) > 0 && !old.cardNo().equals(req.cardNo())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용내역이 등록된 카드의 식별구분값은 수정불가합니다");
            }
            mapper.updateCard(user.getCompanyId(), req);
            return mapper.selectById(user.getCompanyId(), in.cardId());
        }
        long newId = mapper.selectNextId();
        mapper.insertCard(newId, user.getCompanyId(), req);
        return mapper.selectById(user.getCompanyId(), newId);
    }

    /** Crd01_Tab_Card.deleteCheck L282-317 + delete L319-341 — 사용내역이 등록된 카드는 삭제 불가, 아니면 사용자 이력부터 지우고 카드를 지운다 */
    @Transactional
    public int deleteCard(UserPrincipal user, Long cardId) {
        CrdCardRes card = mapper.selectById(user.getCompanyId(), cardId);
        if (card == null) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (card.cardNo() != null && mapper.countDataByCardNo(user.getCompanyId(), card.cardNo()) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용내역이 등록된 카드는 삭제불가합니다");
        }
        mapper.deleteTransByCardId(cardId);
        return mapper.deleteCard(user.getCompanyId(), cardId);
    }

    // ===== Crd03_Grid_User =====

    private void requireCard(UserPrincipal user, Long cardId) {
        if (cardId == null || mapper.selectById(user.getCompanyId(), cardId) == null) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** crd03_trans.selectByCardId */
    public List<CrdCardUserRes> searchUsers(UserPrincipal user, Long cardId) {
        requireCard(user, cardId);
        return mapper.selectUsers(cardId);
    }

    /** Crd03_Grid_User.update L165-197 — 사용자·시작일자 필수(기간 겹침은 화면이 전체 행으로 검사한다) → 저장한 행(요청 순서) */
    @Transactional
    public List<CrdCardUserRes> saveUsers(UserPrincipal user, Long cardId, List<CrdCardUserSaveReq> rows) {
        requireCard(user, cardId);
        for (CrdCardUserSaveReq r : rows) {
            if (r.personId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용자를 선택해주세요.");
            }
            if (r.frDt() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일자를 정확하게 입력해주세요.");
            }
        }
        return rows.stream().map(in -> {
            CrdCardUserSaveReq req = new CrdCardUserSaveReq(in.transId(), in.personId(), in.frDt(), in.toDt(),
                    in.useYn() == null ? "true" : in.useYn(), "true".equals(in.publicYn()) ? "true" : "false");
            if (in.transId() != null && in.transId() > 0) {
                if (mapper.updateUser(cardId, req) == 0) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                return mapper.selectUserById(cardId, in.transId());
            }
            long newId = mapper.selectNextId();
            mapper.insertUser(newId, cardId, req);
            return mapper.selectUserById(cardId, newId);
        }).toList();
    }

    /** Crd03_Grid_User.deleteRow L220-242 (crd03_trans.delete) → 지운 건수 */
    @Transactional
    public int deleteUsers(UserPrincipal user, Long cardId, List<Long> ids) {
        requireCard(user, cardId);
        return ids.isEmpty() ? 0 : mapper.deleteUsers(cardId, ids);
    }
}
