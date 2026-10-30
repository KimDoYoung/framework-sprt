package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.JournalBizCardRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizErpFeeRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizFeeRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizLineRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizRowReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalBizMapper;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * AS-IS server/act/Act02_Journal.java (selectMonthBiz L49 · createJournalBiz L104 · deleteJournalBiz L329) · Act03_JournalDtl.java (selectBizCard L51 · selectChargeFee L57 · selectErpChargeFee L63) — U10.
 * 전표를 만드는 거래 코드: 9001 법인카드 사용 · 1001/1002 사무관리 최저보수 · 1004 AssetERP 사용료 · 그 밖(급여·퇴직정산)은 DB 함수 f_create_journalPayMonth
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalBizService {

    private static final DateTimeFormatter YM = DateTimeFormatter.ofPattern("yyyy.MM");

    private final ActJournalBizMapper mapper;
    private final ActJournalMapper journalMapper;
    private final AstTrMapper trMapper;

    /** act.Act02_Journal.selectMonthBiz */
    public List<JournalBizRes> searchMonth(UserPrincipal user, String stdMonth) {
        return mapper.selectMonthBiz(user.getCompanyId(), stdMonth);
    }

    /** Act02_Grid_CreateJournalBiz.retrieve() L294-350: 고른 행의 거래 코드로 서비스를 가른다 */
    public List<JournalBizLineRes> searchLines(UserPrincipal user, String stdMonth, String trCode, String note, LocalDate date, Long journalId) {
        Long companyId = user.getCompanyId();
        if ("9001".equals(trCode)) return mapper.selectBizCardLines(companyId, stdMonth);
        if ("1001".equals(trCode) || "1002".equals(trCode)) return mapper.selectChargeFeeLines(companyId, stdMonth, trCode, manageType(note));
        if ("1004".equals(trCode)) return mapper.selectErpChargeFeeLines(companyId, date, trCode);
        return mapper.selectJournalLines(companyId, journalId);
    }

    /** 적요 끝 두 글자(운용·자문·일임) → 사무관리 구분 코드 */
    private static String manageType(String note) {
        if (note == null || note.length() < 2) return null;
        return switch (note.substring(note.length() - 2)) {
            case "운용" -> "1";
            case "자문" -> "2";
            case "일임" -> "3";
            default -> null;
        };
    }

    private static BusinessException fail(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }

    private void checkResult(String msg) {
        if (!"Y".equals(msg)) throw fail(msg);
    }

    /** act.Act02_Journal.createJournalBiz — 한 건이라도 실패하면 전체를 되돌린다 */
    @Transactional
    public void createJournals(UserPrincipal user, JournalBizReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        String stdMonth = req.stdMonth();
        for (JournalBizRowReq row : req.rows()) {
            String trCode = row.trCode();
            if ("9001".equals(trCode)) {
                // 법인카드 사용: 카드 내역마다 분개 생성 (미지급금 거래 9006은 AS-IS에서 막혀 있다 — 2025.10.27)
                for (JournalBizCardRes card : mapper.selectBizCards(companyId, stdMonth)) {
                    checkResult(journalMapper.createJournal("P", companyId, personId, trCode, card.promoId(), true));
                }
            } else if ("1001".equals(trCode) || "1002".equals(trCode)) {
                for (JournalBizFeeRes fee : mapper.selectFeeCharges(companyId, stdMonth, trCode, manageType(row.note()))) {
                    long trId = trMapper.selectNextId();
                    mapper.insertTr(trId, fee.astClassTreeId(), fee.chargeDate(), trCode, fee.chargeFee() + fee.tax(), fee.chargeFee(), fee.tax(),
                            "최저보수청구", personId, companyId, fee.corpId());
                    checkResult(journalMapper.createJournal("P", companyId, personId, trCode, trId, true));
                    if (fee.apprId() != null) mapper.insertRelateAppr(fee.apprId(), mapper.selectJournalIdByTrId(trId), trId);
                    mapper.updateFeeChargeTrId(fee.feeChargeId(), trId);
                }
            } else if ("1004".equals(trCode)) {
                for (JournalBizErpFeeRes fee : mapper.selectErpFeeCharges(companyId, trCode, row.date())) {
                    long trId = trMapper.selectNextId();
                    mapper.insertTr(trId, fee.astClassTreeId(), fee.chargeDate(), trCode, fee.chargeAmt(), fee.totalAmt(), fee.totalVat(),
                            fee.note(), personId, companyId, fee.corpId());
                    checkResult(journalMapper.createJournal("P", companyId, personId, trCode, trId, true));
                    if (fee.apprId() != null) mapper.insertRelateAppr(fee.apprId(), mapper.selectJournalIdByTrId(trId), trId);
                    mapper.updateErpFeeChargeTrId(fee.erpFeeChargeId(), trId);
                }
            } else {
                // 급여, 퇴직정산
                checkResult(mapper.createJournalPayMonth(companyId, personId, row.date(), row.payMonthCode(), row.retireId()));
            }
        }
    }

    /** act.Act02_Journal.deleteJournalBiz */
    @Transactional
    public void deleteJournals(UserPrincipal user, JournalBizReq req) {
        Long companyId = user.getCompanyId();
        String stdMonth = req.stdMonth();
        for (JournalBizRowReq row : req.rows()) {
            String trCode = row.trCode();
            if ("9001".equals(trCode)) {
                for (JournalBizCardRes card : mapper.selectBizCards(companyId, stdMonth)) {
                    mapper.deleteJournalTmpByBizId(card.promoId());
                    mapper.deleteJournalDtlByBizId(card.promoId());
                    mapper.deleteJournalByBizId(card.promoId());
                }
                // 법인카드미지급금(9006) 거래 삭제 (미지급금 결제내역이 있으면 같이) — 분개·결제내역만 지우고 거래(ast06_tr)는 남긴다
                LocalDate trDate = YearMonth.parse(stdMonth, YM).atEndOfMonth();
                List<Long> trIds = mapper.selectTrIdsByDate(companyId, "9006", trDate);
                if (trIds.size() > 1) throw fail("법인카드미지급금 거래가 1건이상 존재합니다. 관리자에게 문의하세요");
                if (trIds.size() == 1) {
                    Long trId = trIds.get(0);
                    trMapper.deleteJournalTmpByTrId(trId);
                    trMapper.deleteJournalDtlByTrId(trId);
                    trMapper.deleteJournalByTrId(trId);
                    trMapper.deleteSettleByTrId(trId);
                }
            } else if ("1001".equals(trCode) || "1002".equals(trCode)) {
                for (JournalBizFeeRes fee : mapper.selectFeeCharges(companyId, stdMonth, trCode, manageType(row.note()))) {
                    deleteTrJournal(companyId, fee.trId());
                    mapper.updateFeeChargeTrId(fee.feeChargeId(), null);
                }
            } else if ("1004".equals(trCode)) {
                for (JournalBizErpFeeRes fee : mapper.selectErpFeeCharges(companyId, trCode, row.date())) {
                    deleteTrJournal(companyId, fee.trId());
                    mapper.updateErpFeeChargeTrId(fee.erpFeeChargeId(), null);
                }
            } else {
                mapper.deleteJournalTmpById(companyId, row.journalId());
                mapper.deleteJournalDtlById(companyId, row.journalId());
                mapper.deleteJournalById(companyId, row.journalId());
            }
        }
    }

    /** 분개삭제(결제포함) → 연결문서 삭제 → 거래삭제 */
    private void deleteTrJournal(Long companyId, Long trId) {
        if (trId == null) return;
        trMapper.deleteJournalTmpByTrId(trId);
        trMapper.deleteJournalDtlByTrId(trId);
        trMapper.deleteJournalByTrId(trId);
        trMapper.deleteRelateApprByTrId(trId);
        trMapper.deleteSettleByTrId(trId);
        trMapper.deleteTr(companyId, trId);
    }
}
