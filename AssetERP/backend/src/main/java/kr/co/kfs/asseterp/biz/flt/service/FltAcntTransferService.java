package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferBookReq;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferRes;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltTrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 계좌대체 (AS-IS Flt10_Tab_AcntTransfer → server/flt/Flt10_Tr.java selectByTrType L61 / update L696 / delete2 L742 / insertFloorTrBook L459)
 * — 로그인 사용자(회사·사원) 본인의 계좌대체(30N)만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltAcntTransferService {

    private final FltTrMapper mapper;

    /** AS-IS selectByTrType — 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<AcntTransferRes> search(UserPrincipal user, Long accountId, String startDate, String closeDate, String searchText) {
        return mapper.selectAcntTransfers(user.getCompanyId(), user.getUserId(), accountId, startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS update(UpdateDataModel): 최초원장 기준일 이전 거래는 막고(전부 검사한 뒤 저장), 종목명 공백을 지우고, 예치금(99)은 금액 = 수량.
     * trId 0 이하 INSERT 아니면 UPDATE → selectById로 다시 읽어 요청 순서대로
     */
    @Transactional
    public List<AcntTransferRes> update(UserPrincipal user, List<AcntTransferSaveReq> rows) {
        String initDate = mapper.selectInitDate(user.getCompanyId(), user.getUserId());
        List<AcntTransferSaveReq> list = new ArrayList<>();
        for (AcntTransferSaveReq src : rows) {
            if (initDate != null && src.regDate() != null && initDate.compareTo(src.regDate()) >= 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "최초원장 기준일 이전의 거래내역은 등록할 수 없습니다");
            }
            Long trAmt = "99".equals(src.trItemType()) ? (long) (src.trQty() == null ? 0 : src.trQty()) : src.trAmt();
            list.add(new AcntTransferSaveReq(src.trId(), src.regDate(), src.trItemType(),
                    src.trItemName() == null ? null : src.trItemName().trim(), src.trItemCode(), src.trQty(), trAmt,
                    src.outAccountId(), src.accountId()));
        }
        List<AcntTransferRes> saved = new ArrayList<>();
        for (AcntTransferSaveReq req : list) {
            boolean isNew = req.trId() == null || req.trId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.trId();
            if (isNew) {
                mapper.insertAcntTransfer(id, user.getCompanyId(), user.getUserId(), req);
            } else if (mapper.updateAcntTransfer(user.getCompanyId(), user.getUserId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectAcntTransferById(user.getCompanyId(), user.getUserId(), id));
        }
        return saved;
    }

    /**
     * AS-IS delete2 — 행을 지운 뒤 행마다 그 종목의 원장을 대체일부터 다시 만든다(원본은 요청에 실린 종목, 여기는 지우기 전에 읽은 값).
     * 원장 함수가 'Y'가 아닌 글자를 주면 그 글자가 오류 메시지 → 한 트랜잭션이라 모두 되돌린다. 지운 건수
     */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        List<AcntTransferRes> targets = new ArrayList<>();
        for (Long id : ids) {
            AcntTransferRes row = mapper.selectAcntTransferById(user.getCompanyId(), user.getUserId(), id);
            if (row != null) {
                targets.add(row);
            }
        }
        int count = mapper.deleteTrs(user.getCompanyId(), user.getUserId(), ids);
        for (AcntTransferRes row : targets) {
            insertFloorTrBook(user, new AcntTransferBookReq(row.trItemType(), row.trItemName(), row.trItemCode(), row.regDate()));
        }
        return count;
    }

    /** AS-IS insertFloorTrBook(원장생성, 종목 한정) — 함수가 'Y'가 아닌 글자를 주면 그 글자가 오류 메시지 */
    @Transactional
    public void insertFloorTrBook(UserPrincipal user, AcntTransferBookReq req) {
        String msg = mapper.insertFloorTrBookItem(user.getCompanyId(), user.getUserId(), req.trItemType(),
                req.trItemName(), req.trItemCode(), req.regDate());
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg == null ? "원장생성에 실패했습니다" : msg);
        }
    }
}
