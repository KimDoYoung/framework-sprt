package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.mapper.BizContCorpMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 계약사 관리 Biz10_Tab_ContCorp (EE20) — AS-IS server/biz 의 Biz10_ContCorp·Biz11_ContHistory·Biz12_FeeInfo·Biz13_WithCorp·Biz14_RelateAppr
 * ·Biz15_Share·Biz16_EachCont·Biz17_DualManageFund 8개 서비스를 한 화면 묶음이라 한 서비스로 모았다. 메서드 이름 옆에 AS-IS 서비스 메서드를 적는다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizContCorpService {

    /** Sys99_Print.insertRdContCorp 의 windowClassName */
    private static final String PRINT_WINDOW = "Biz10_Tab_ContCorp";

    private final BizContCorpMapper mapper;

    // ── Biz10_ContCorp ──

    /** biz.Biz10_ContCorp.selectByText (L27-48) — 검색어는 '%…%', 거래종료 개월이 비면 null, 정렬은 계약일(1) */
    public List<BizContCorpRes> search(UserPrincipal user, String searchText, boolean check, String stdYear, String statusCode,
                                       boolean statusCheck, String endMonth) {
        Long month = endMonth == null || endMonth.isBlank() ? null : parseMonth(endMonth);
        return mapper.selectByText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%", String.valueOf(check), stdYear,
                statusCode == null || statusCode.isEmpty() ? "%" : statusCode, String.valueOf(statusCheck), month, "1");
    }

    private static Long parseMonth(String s) {
        try {
            return Long.parseLong(s.trim());
        } catch (NumberFormatException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "거래종료 개월은 숫자로 입력해주세요.");
        }
    }

    /** biz.Biz10_ContCorp.selectById (L21-25) */
    public BizContCorpRes get(UserPrincipal user, Long contCorpId) {
        BizContCorpRes r = mapper.selectById(contCorpId, user.getCompanyId());
        if (r == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "계약사를 찾을 수 없습니다.");
        }
        return r;
    }

    /** getSeq (dbConfig.getSeq → f_create_seq()) — 편집창이 새 이력·공유자에 쓸 번호를 미리 받는다 */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /** biz.Biz10_ContCorp.insertUpdate (L59-107) */
    @Transactional
    public BizContSaveRes save(UserPrincipal user, BizContSaveReq req) {
        if (req == null || req.history() == null || req.fee() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "저장할 내용이 없습니다.");
        }
        Long companyId = user.getCompanyId();
        Long contCorpId = req.contCorpId();
        if (contCorpId == null) {
            contCorpId = mapper.selectNextId();
            mapper.insertCorp(contCorpId, companyId);
        } else {
            requireCorp(contCorpId, companyId);
        }
        BizContSaveReq.History h = req.history();
        Long contHistoryId = h.contHistoryId();
        if (contHistoryId == null) {
            contHistoryId = mapper.selectNextId();
            // Biz15_Share Update (biz15_share.insertUpdate): 가장 최근 이력의 공유자를 새 이력으로 복사
            mapper.copyShareFromLatest(contCorpId, contHistoryId);
        }
        BizContSaveReq.History hh = new BizContSaveReq.History(contHistoryId, h.regDate(), h.contCorpNm(), h.contStatusCd(), h.corpStatusCd(),
                h.trType(), h.contPeriodCd(), h.contDate(), h.startDate(), h.closeDate(), h.baseFee(), h.manager(), h.managerTel(), h.note(),
                h.personId(), h.address(), h.ceo());
        if (mapper.updateHistory(contCorpId, hh) == 0) {
            mapper.insertHistory(contCorpId, hh);
        }
        BizContSaveReq.Fee f = req.fee();
        Long feeInfoId = f.feeInfoId() == null ? mapper.selectNextId() : f.feeInfoId();
        BizContSaveReq.Fee ff = new BizContSaveReq.Fee(feeInfoId, f.minFeeYn(), f.manageMinFee(), f.advMinFee(), f.discrMinFee(),
                f.feeChargeType(), f.withYn(), f.withFee());
        if (mapper.updateFeeInfo(contHistoryId, ff) == 0) {
            mapper.insertFeeInfo(contHistoryId, ff);
        }
        return new BizContSaveRes(contCorpId, contHistoryId);
    }

    /** biz.Biz11_ContHistory.deleteContCorpId (L51-61) → biz.Biz10_ContCorp.delete (L114-117) — 하위 5개 표를 지운 뒤 계약사를 지운다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> contCorpIds) {
        int n = 0;
        for (Long id : contCorpIds) {
            requireCorp(id, user.getCompanyId());
            mapper.deleteSharesByCorp(id);
            mapper.deleteRelateApprsByCorp(id);
            mapper.deleteWithCorpsByCorp(id);
            mapper.deleteFeeInfosByCorp(id);
            mapper.deleteHistoriesByCorp(id);
            n += mapper.deleteCorp(id, user.getCompanyId());
        }
        return n;
    }

    private void requireCorp(Long contCorpId, Long companyId) {
        if (mapper.countCorp(contCorpId, companyId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "계약사를 찾을 수 없습니다.");
        }
    }

    // ── Biz11_ContHistory ──

    /** biz.Biz11_ContHistory.selectByContCorpId (L25) */
    public List<BizContCorpRes> searchHistories(UserPrincipal user, Long contCorpId) {
        return mapper.selectHistories(contCorpId, user.getCompanyId());
    }

    /** biz.Biz11_ContHistory.deleteCheck (L35-49) — 이력 수 */
    public int countHistories(UserPrincipal user, Long contCorpId) {
        requireCorp(contCorpId, user.getCompanyId());
        return mapper.selectHistoryIds(contCorpId).size();
    }

    /** biz.Biz11_ContHistory.delete (L77) */
    @Transactional
    public int deleteHistories(UserPrincipal user, List<Long> contHistoryIds) {
        return mapper.deleteHistories(contHistoryIds, user.getCompanyId());
    }

    // ── Biz12_FeeInfo ──

    /** biz.Biz12_FeeInfo.modelUpdate (L23-34) — 보수정보 편집창 [저장]. 저장한 모델을 돌려준다 */
    @Transactional
    public BizContFeeInfoRes saveFeeInfo(UserPrincipal user, BizContFeeInfoReq req) {
        Long feeInfoId = req.feeInfoId() == null ? mapper.selectNextId() : req.feeInfoId();
        BizContSaveReq.Fee f = new BizContSaveReq.Fee(feeInfoId, req.minFeeYn(), req.manageMinFee(), req.advMinFee(), req.discrMinFee(),
                req.feeChargeType(), req.withYn(), req.withFee());
        if (mapper.updateFeeInfo(req.contHistoryId(), f) == 0) {
            mapper.insertFeeInfo(req.contHistoryId(), f);
        }
        return mapper.selectFeeInfoById(feeInfoId, user.getCompanyId());
    }

    // ── Biz15_Share ──

    /** biz.Biz15_Share.selectByContHistoryId (L25) */
    public List<BizContShareRes> searchShares(UserPrincipal user, Long contHistoryId) {
        return mapper.selectShares(contHistoryId, user.getCompanyId());
    }

    /** biz.Biz15_Share.insert (L35) — 새 이력 창을 열 때 직전 이력의 공유자를 복사 */
    @Transactional
    public int copyShares(UserPrincipal user, Long contCorpId, Long contHistoryId) {
        requireCorp(contCorpId, user.getCompanyId());
        return mapper.copyShareFromPrevious(contCorpId, contHistoryId);
    }

    /** biz.Biz15_Share.update (L44) 로 새로 추가한 공유자/부서 → 지운 것은 biz.Biz15_Share.delete (L49) */
    @Transactional
    public int saveShares(UserPrincipal user, List<BizContShareReq> adds, List<Long> deleteIds) {
        int n = 0;
        if (deleteIds != null && !deleteIds.isEmpty()) {
            n += mapper.deleteShares(deleteIds, user.getCompanyId());
        }
        if (adds != null) {
            for (BizContShareReq r : adds) {
                n += mapper.insertShare(mapper.selectNextId(), r, user.getCompanyId());
            }
        }
        return n;
    }

    // ── Biz13_WithCorp ──

    /** biz.Biz13_WithCorp.selectByHistoryContCorpId (L40) */
    public List<BizContWithCorpRes> searchWithCorps(UserPrincipal user, Long contCorpId) {
        return mapper.selectWithCorps(contCorpId, user.getCompanyId());
    }

    /** biz.Biz13_WithCorp.update (L72) */
    @Transactional
    public int saveWithCorps(UserPrincipal user, List<BizContWithCorpReq> rows) {
        int n = 0;
        for (BizContWithCorpReq r : rows) {
            requireCorp(r.contCorpId(), user.getCompanyId());
            if (r.withCorpId() != null && r.withCorpId() > 0 && mapper.updateWithCorp(r, user.getCompanyId()) > 0) {
                n++;
            } else {
                n += mapper.insertWithCorp(mapper.selectNextId(), r, user.getCompanyId());
            }
        }
        return n;
    }

    /** biz.Biz13_WithCorp.delete (L77) */
    @Transactional
    public int deleteWithCorps(UserPrincipal user, List<Long> ids) {
        return mapper.deleteWithCorps(ids, user.getCompanyId());
    }

    // ── Biz14_RelateAppr ──

    /** biz.Biz14_RelateAppr.selectByContHistoryId (L23) */
    public List<BizContRelateApprRes> searchRelateApprs(UserPrincipal user, Long contHistoryId) {
        return mapper.selectRelateApprs(contHistoryId, user.getCompanyId());
    }

    /** biz.Biz14_RelateAppr.modelUpdate (L29-40) */
    @Transactional
    public long createRelateAppr(BizContRelateApprReq req) {
        long id = mapper.selectNextId();
        mapper.insertRelateAppr(id, req);
        return id;
    }

    /** biz.Biz14_RelateAppr.delete (L47) */
    @Transactional
    public int deleteRelateApprs(List<Long> ids) {
        return mapper.deleteRelateApprs(ids);
    }

    // ── Biz16_EachCont ──

    /** biz.Biz16_EachCont.selectByCorpId (L25) */
    public List<BizContEachRes> searchEachConts(UserPrincipal user, Long contCorpId) {
        return mapper.selectEachConts(contCorpId, user.getCompanyId());
    }

    /** biz.Biz16_EachCont.selectByContCorpId (L34) */
    public List<BizContEachAddrRes> searchEachContAddr(UserPrincipal user, Long contCorpId) {
        return mapper.selectEachContAddr(contCorpId, user.getCompanyId());
    }

    /** biz.Biz16_EachCont.update (L63) */
    @Transactional
    public int saveEachConts(UserPrincipal user, List<BizContEachReq> rows) {
        int n = 0;
        for (BizContEachReq r : rows) {
            requireCorp(r.contCorpId(), user.getCompanyId());
            if (r.contractId() != null && r.contractId() > 0 && mapper.updateEachCont(r, user.getCompanyId()) > 0) {
                n++;
            } else {
                n += mapper.insertEachCont(mapper.selectNextId(), r, user.getCompanyId());
            }
        }
        return n;
    }

    /** biz.Biz16_EachCont.delete (L68) */
    @Transactional
    public int deleteEachConts(UserPrincipal user, List<Long> ids) {
        return mapper.deleteEachConts(ids, user.getCompanyId());
    }

    /** biz.Biz16_EachCont.updateApprId (L43) */
    @Transactional
    public int updateEachContApprId(UserPrincipal user, Long contractId, Long apprId) {
        return mapper.updateEachContApprId(contractId, apprId, user.getCompanyId());
    }

    // ── Biz17_DualManageFund ──

    /** biz.Biz17_DualManageFund.selectByContCorpId (L25) */
    public List<BizContDualFundRes> searchDualFunds(UserPrincipal user, Long contCorpId) {
        return mapper.selectDualFunds(contCorpId, user.getCompanyId());
    }

    /** biz.Biz17_DualManageFund.update (L34) */
    @Transactional
    public int saveDualFunds(UserPrincipal user, List<BizContDualFundReq> rows) {
        int n = 0;
        for (BizContDualFundReq r : rows) {
            requireCorp(r.contCorpId(), user.getCompanyId());
            if (r.dualFundId() != null && r.dualFundId() > 0 && mapper.updateDualFund(r, user.getCompanyId()) > 0) {
                n++;
            } else {
                n += mapper.insertDualFund(mapper.selectNextId(), r, user.getCompanyId());
            }
        }
        return n;
    }

    /** biz.Biz17_DualManageFund.delete (L39) */
    @Transactional
    public int deleteDualFunds(UserPrincipal user, List<Long> ids) {
        return mapper.deleteDualFunds(ids, user.getCompanyId());
    }

    /** ast.Ast30_BookFundFee.selectByContCorpId (L60) — 펀드 조회창(Biz17_Lookup_HoldFee), 검색어는 '%…%' */
    public List<BizContHoldFeeRes> searchHoldFees(UserPrincipal user, Long contCorpId, String holdDate, String searchText) {
        return mapper.selectHoldFees(user.getCompanyId(), holdDate, contCorpId, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** sys.Sys99_Print.insertRdContCorp (L998-1062) — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과(selectByText)를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 의 rdGroupId) */
    @Transactional
    public String rdPrint(UserPrincipal user, BizContPrintReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, PRINT_WINDOW);
        Long month = req.endMonth() == null || req.endMonth().isBlank() ? null : parseMonth(req.endMonth());
        List<BizContCorpRes> list = mapper.selectByText(companyId, "%" + (req.searchText() == null ? "" : req.searchText()) + "%",
                String.valueOf(req.check()), req.stdYear(), req.statusCode() == null || req.statusCode().isEmpty() ? "%" : req.statusCode(),
                String.valueOf(req.statusCheck()), month, req.sortType());
        for (BizContCorpRes r : list) {
            mapper.insertPrint(mapper.selectNextId(), companyId, personId, PRINT_WINDOW, groupId, r);
        }
        return String.valueOf(groupId);
    }
}
