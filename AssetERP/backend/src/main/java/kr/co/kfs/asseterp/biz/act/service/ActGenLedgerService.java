package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.CloseCheckRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseDiffRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseParam;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseNoteRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseProcessRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerCloseStatusRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActGenLedgerMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * 회계마감 Act04_Tab_Close (X14) — AS-IS Act04_GenLedger.selectCloseStatus(L51) · insertClose(L199) · closeValidate(L382).
 * AS-IS 서비스 브로커는 결과 status가 0 미만이면 rollback, 아니면 commit한다(ServiceBrokerImpl L125).
 * TOBE는 실패(status -1)일 때 rollback-only로 표시하되 마감현황(notes)은 응답에 담아 돌려준다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActGenLedgerService {

    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final LocalDate FEE_CHECK_FROM = LocalDate.of(2022, 12, 31);

    private final ActGenLedgerMapper mapper;

    /** act04_gen_ledger.selectCloseStatus */
    public List<GenLedgerCloseStatusRes> searchCloseStatus(UserPrincipal user, String year) {
        return mapper.selectCloseStatus(user.getCompanyId(), year);
    }

    /** 처리 중 결과 모으기 — AS-IS ServiceResult(status·message·list)와 Act04_GenLedgerModel.note 목록 */
    private static final class Ctx {
        int status = 0;
        String message = "";
        final List<GenLedgerCloseNoteRes> notes = new ArrayList<>();
        long seq = 0;

        void fail(String msg) {
            status = -1;
            message = msg;
        }

        void note(String text) {
            notes.add(new GenLedgerCloseNoteRes(++seq, text));
        }
    }

    /** Act04_GenLedger.insertClose — procType P 마감 · C 마감취소 · A 마감검증 */
    @Transactional
    public GenLedgerCloseProcessRes close(UserPrincipal user, GenLedgerCloseReq req) {
        Ctx c = new Ctx();
        run(c, user.getCompanyId(), req);
        if (c.status < 0) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return new GenLedgerCloseProcessRes(c.status, c.message, c.notes);
    }

    private void run(Ctx c, Long companyId, GenLedgerCloseReq req) {
        if (req == null || req.closeDate() == null) throw invalid("선택된 월이 없습니다.");
        LocalDate closeDate = req.closeDate();
        String procType = req.procType();

        String plAccountCode = "1200000000";   // 당기순손익
        String eicpAccountCode = "7507000000"; // 미처분이익잉여금
        // 타이거자산운용(202602068093742) 계정과목 예외처리
        if (companyId == 202602068093742L) {
            plAccountCode = "99990";
            eicpAccountCode = "37700";
        }

        CloseParam base = CloseParam.of(companyId, closeDate);

        // 처리전 결산일 이후 마감여부 체크
        if (mapper.checkCloseCount(base) > 0) {
            c.fail("처리일 이후의  회계마감 내역이 존재합니다.");
            return;
        }
        long checkCount = mapper.selectCloseDateCount(base);

        if ("P".equals(procType)) {
            if (checkCount > 0) {
                c.fail("이미 회계마감이 완료되었습니다. 마감취소 후 재마감 가능합니다.");
                return;
            }
            if (!closeValidate(c, companyId, closeDate, req, procType)) return;

            // 연결산일 처리
            LocalDate yearCloseDate = mapper.getCompanyCloseDate(companyId, String.valueOf(closeDate.getYear()), "2");
            if (closeDate.equals(yearCloseDate)) {
                LocalDate nextStart = closeDate.plusDays(1);
                // 다음 결산회기정보 생성
                if (mapper.selectAccountNumByStartDate(companyId, nextStart).isEmpty()) {
                    List<Long> cur = mapper.selectAccountNumByStartDate(companyId, closeDate);
                    long curNum = cur.isEmpty() || cur.get(0) == null ? 0L : cur.get(0);
                    mapper.insertAccountNumNext(companyId, curNum + 1, closeDate);
                }
                // "당기순손익 => 미처분이익잉여금" 계정대체
                Long todayBalAmt = mapper.selectTodayBalAmtByAccountCode(companyId, closeDate, plAccountCode);
                if (closeDate.equals(LocalDate.of(2021, 12, 31)) && (companyId == 1L || companyId == 28000L)) {
                    // 한국펀드서비스는 이미 2021.12.31에 수기전표로 맞춰놓고 시작하므로 계정대체하지 않는다
                } else {
                    for (String code : mapper.selectTreeAccountCodes(companyId, eicpAccountCode)) {
                        if (mapper.selectCountByAccountCode(companyId, closeDate, code) == 0) {
                            mapper.insertUnApprEarnSurplus(companyId, closeDate, code, todayBalAmt);
                        } else {
                            mapper.updateUnApprEarnSurplus(companyId, closeDate, code, todayBalAmt);
                        }
                    }
                }
            }
            // 계정마감원장(act05) 생성 + 미처분이익잉여금 계상 (자산마감원장은 금융상품 평가처리에서 만든다 — AS-IS 주석)
            mapper.insertGenLedgerClose(companyId, closeDate);
            mapper.insertGenLedgerCloseEicp(companyId, closeDate);
            // 분개장 마감여부 UPDATE
            mapper.updateJournalCloseYn(companyId, closeDate, "true");
        } else if ("C".equals(procType)) {
            if (checkCount == 0) {
                c.fail("회계마감 전 입니다.");
                return;
            }
            mapper.deleteGenLedgerClose(companyId, closeDate);
            mapper.updateJournalCloseYn(companyId, closeDate, "false");
        } else if ("A".equals(procType)) {
            if (checkCount > 0) {
                c.fail("이미 회계마감이 완료되었습니다");
                return;
            }
            if (!closeValidate(c, companyId, closeDate, req, procType)) return;
        } else {
            c.fail("처리구분값 오류 - 관리자에 문의하세요");
            return;
        }
        c.status = 1;
    }

    /**
     * closeValidate L382-633. 마감(P)이면 첫 실패에서 false로 돌아가고(errReturn), 마감검증(A)이면 끝까지 돌려 결과만 모은다.
     * 단계마다 status를 1로 되돌리는 AS-IS 동작(앞 실패가 뒤 성공에 덮임)을 그대로 따른다.
     */
    private boolean closeValidate(Ctx c, Long companyId, LocalDate closeDate, GenLedgerCloseReq req, String procType) {
        boolean errReturn = !"A".equals(procType);
        NumberFormat nf = NumberFormat.getInstance(Locale.US);

        CloseParam base = CloseParam.of(companyId, closeDate);
        // 1. 정리시작일 (최근마감일 + 1일, 최근마감일이 없다면 결산월 기준 — 한국펀드서비스는 2021-12-31)
        LocalDate preCloseDate = mapper.selectCloseDate(base);
        LocalDate startDate;
        if (preCloseDate == null) {
            startDate = companyId == 1L ? LocalDate.of(2021, 12, 31) : closeDate;
        } else {
            // 최근마감일이 전월이 아닌 경우 처리불가
            LocalDate preMonthLastDay = mapper.selectPreMonthLastDay(closeDate);
            if (!preMonthLastDay.equals(preCloseDate) && errReturn) {
                c.fail("전월 회계마감 후 처리가능합니다.");
                return false;
            }
            startDate = preCloseDate.plusDays(1);
        }
        CloseParam param = base.withStart(startDate);
        CloseParam diff = base; // companyId + holdDate(=closeDate)

        String depositDateInfo = mapper.setDateInfo(startDate, LocalDate.now());
        String accountDateInfo = mapper.setDateInfo(startDate, closeDate);

        // 2. 예금원장 정리(결산전용)
        if (Boolean.TRUE.equals(req.depositUpdateYn())) {
            String msg = mapper.createDepositBookClose(param);
            if ("Y".equals(msg)) {
                c.status = 1;
                c.note("■ 예금원장 정리가 완료되었습니다. (정리기간 : " + depositDateInfo + " / 처리일시 : " + now() + ")");
            } else {
                c.fail(msg);
                c.note("□ 예금원장 정리를 실패하였습니다. - " + msg);
            }
            if (c.status != 1 && errReturn) return false;
        }

        // 3. 계정원장 정리
        if (Boolean.TRUE.equals(req.genLedgerUpdateYn())) {
            String msg = mapper.summaryGenLedger(param);
            if ("Y".equals(msg)) {
                c.status = 1;
                c.note("■ 계정원장 정리가 완료되었습니다. (정리기간 : " + accountDateInfo + " / 처리일시 : " + now() + ")");
            } else {
                c.fail(msg);
                c.note("□ 계정원장 정리를 실패하였습니다. - " + msg);
            }
            if (c.status != 1 && errReturn) return false;
        }

        // 마감검증 체크항목
        CloseCheckRes chk = mapper.selectCloseCheck(companyId);
        if (chk == null) throw invalid("마감검증 체크항목을 찾을 수 없습니다.");

        // 4. 예금원장 vs 실예금잔고 대사
        if (yes(chk.depositRealMatchYn())) {
            List<CloseDiffRes> list = mapper.selectDepositRealDiff(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 예금원장vs실예금잔고 마감일의 대사작업이 완료되었습니다. 차이금액이 없습니다. (처리일시 : " + now() + ")");
            } else {
                c.fail("예금잔고대사시 불일치금액이 존재합니다. 확인하여주세요");
                c.note("□ 예금원장vs실예금잔고 마감일의 대사작업이 완료되었습니다. 불일치금액이 " + list.size() + "건 존재합니다. (처리일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) {
                    c.note("  => (관리계좌 : " + s(d.astClassTreeName()) + " / 차이금액 : " + nf.format(n(d.drTodayDiffAmt())) + ")");
                }
                if (errReturn) return false;
            }
        }

        // 4-1. 예금대사 결과보고 상신문서 결재완료 체크
        if (yes(chk.depositApprYn())) {
            List<CloseDiffRes> list = mapper.selectDepositApprStatus(diff);
            if (!list.isEmpty()) {
                CloseDiffRes d = list.get(0);
                if ("30".equals(d.checkCode())) {
                    c.status = 1;
                    c.note("■ 예금대사 결과보고 상신문서 체크가 완료되었습니다. (문서상태:결재완료) (처리일시 : " + now() + ")");
                } else {
                    c.fail("예금대사 결과보고 상신문서가 미완료입니다. 결재완료 후 회계마감이 가능합니다.");
                    c.note("□ 예금대사 결과보고 상신문서 체크가 완료되었습니다. (문서상태:" + s(d.note()) + ") (처리일시 : " + now() + ")");
                }
            } else {
                c.fail("예금대사 결과보고 상신문서가 미완료입니다. 결재완료 후 회계마감이 가능합니다.");
                c.note("□ 예금대사 결과보고 상신문서 체크가 완료되었습니다. (문서상태:미상신) (처리일시 : " + now() + ")");
            }
            if (c.status != 1 && errReturn) return false;
        }

        // 5. 예금원장 vs 계정원장(예금계정) 대사
        if (yes(chk.depositLedgerMatchYn())) {
            List<CloseDiffRes> list = mapper.selectBookDiff(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 예금원장vs계정원장(예금계정) 마감일의 대사작업이 완료되었습니다. 차이금액이 없습니다. (처리일시 : " + now() + ")");
            } else {
                c.fail("잔액대사시 불일치금액이 존재합니다. 확인하여주세요");
                c.note("□ 예금원장vs계정원장(예금계정) 마감일의 대사작업이 완료되었습니다. 불일치 금액이 " + list.size() + "건 존재합니다. (처리일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) {
                    c.note("  => (계정과목 : " + s(d.accountName()) + "(" + s(d.accountCode()) + ") / 관리계좌 : " + s(d.astClassTreeName())
                            + " / 차이금액 : " + nf.format(n(d.drTodayDiffAmt())) + ")");
                }
                if (errReturn) return false;
            }
        }

        // 6. 금융자산 평가체크
        if (yes(chk.financeEvalYn())) {
            List<CloseDiffRes> list = mapper.selectNoEvalFinance(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 금융자산의 평가체크가 완료되었습니다. 평가 누락된 금융자산이 없습니다. (체크일시 : " + now() + ")");
            } else {
                c.fail("평가가 누락된 금융자산이 존재합니다. 확인하여주세요");
                c.note("□ 평가가 누락된 금융자산 " + list.size() + "건 존재합니다. (체크일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) c.note("  => " + s(d.astClassTreeName()));
                if (errReturn) return false;
            }
        }

        // 6-1. 금융상품 원장대사 (보유원장 vs 계정원장)
        if (yes(chk.financeLedgerMatchYn())) {
            List<CloseDiffRes> list = mapper.selectFinanceBookDiff(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 금융상품 보유원장vs계정원장(증권자산계정) 마감일의 대사작업이 완료되었습니다. 차이금액이 없습니다. (체크일시 : " + now() + ")");
            } else {
                c.fail("금융상품 원장대사(보유원장 vs 계정원장)시 불일치금액이 존재합니다. 확인하여주세요");
                c.note("□ 금융상품 보유원장vs계정원장(증권자산계정) 마감일의 대사작업이 완료되었습니다. 불일치 금액이 " + list.size() + "건 존재합니다. (체크일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) c.note(ledgerLine(nf, d));
                if (errReturn) return false;
            }
        }

        // 7. 환평가 체크
        if (yes(chk.fxEvalYn())) {
            List<CloseDiffRes> list = mapper.selectNoFxEval(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 외화예금의 환평가체크가 완료되었습니다. 평가 누락된 외화예금이 없습니다. (체크일시 : " + now() + ")");
            } else {
                c.fail("환평가가 누락된 외화예금이 존재합니다. 확인하여주세요");
                c.note("□ 환평가가 누락된 외화예금 " + list.size() + "건 존재합니다. (체크일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) c.note("  => " + s(d.astClassTreeName()));
                if (errReturn) return false;
            }
        }

        // 8. 감가상각 체크
        if (yes(chk.depnYn())) {
            List<CloseDiffRes> list = mapper.selectNoDepn(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 감가상각자산의 감가상각처리 체크가 완료되었습니다. 상각 누락된 자산이 없습니다. (체크일시 : " + now() + ")");
            } else {
                c.fail("감가상각처리가 누락된 자산이 존재합니다. 확인하여주세요");
                c.note("□ 감가상각처리가 누락된 자산 " + list.size() + "건 존재합니다. (체크일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) c.note("  => " + s(d.astClassTreeName()));
                if (errReturn) return false;
            }
        }

        // 8-1. 유형자산 원장대사 (잔여상각액 vs 유형자산 상위집계계정)
        if (yes(chk.tangibleMatchYn())) {
            List<CloseDiffRes> list = mapper.selectRemDepnCostDiff(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 유형자산(잔여상각액 vs 유형자산 상위집계계정) 마감일의 대사작업이 완료되었습니다. 차이금액이 없습니다. (체크일시 : " + now() + ")");
            } else {
                CloseDiffRes d = list.get(0);
                c.fail("유형자산 원장대사(잔여상각액 vs 유형자산 상위집계계정)시 불일치금액이 존재합니다. 확인하여주세요");
                c.note("□ 유형자산(잔여상각액 vs 유형자산 상위집계계정) 마감일의 대사작업이 완료되었습니다. 금액이 일치하지 않습니다. ("
                        + "보유원장의 잔여상각액 " + nf.format(n(d.drTodayBalAmt())) + " / "
                        + "계정원장의 유형자산 " + nf.format(n(d.crTodayBalAmt())) + " / "
                        + "차이금액 " + nf.format(n(d.drTodayDiffAmt())) + ") (체크일시 : " + now() + ")");
            }
            if (c.status != 1 && errReturn) return false;
        }

        // 소모품-비품 : 당기발생분 원장생성여부 체크 (2025.06.19 CYY : 소모품-비품도 원장생성하기로 함)
        if (yes(chk.supplyMatchYn())) {
            List<CloseDiffRes> list = mapper.selectCurrYearOfficeAssetsDiff(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 소모품-비품(비품원장 vs 계정원장) 마감일의 대사작업이 완료되었습니다. 차이금액이 없습니다. (체크일시 : " + now() + ")");
            } else {
                CloseDiffRes d = list.get(0);
                c.fail("소모품-비품 원장대사(비품원장 vs 계정원장)시 불일치금액이 존재합니다. 확인하여주세요");
                c.note("□ 소모품-비품(비품원장 vs 계정원장) 마감일의 대사작업이 완료되었습니다. 금액이 일치하지 않습니다. ("
                        + "비품원장 취득금액 " + nf.format(n(d.drTodayBalAmt())) + " / "
                        + "계정원장 발생금액 " + nf.format(n(d.crTodayBalAmt())) + " / "
                        + "차이금액 " + nf.format(n(d.drTodayDiffAmt())) + ") (체크일시 : " + now() + ")");
            }
            if (c.status != 1 && errReturn) return false;
        }

        // 8-2. 무형자산 원장대사 (잔여상각액 vs 계정원장)
        if (yes(chk.intangibleMatchYn())) {
            List<CloseDiffRes> list = mapper.selectRemDepnCostDiff2(diff);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 무형자산(잔여상각액 vs 무형자산계정) 마감일의 대사작업이 완료되었습니다. 차이금액이 없습니다. (체크일시 : " + now() + ")");
            } else {
                c.fail("무형자산 원장대사(잔여상각액 vs 계정원장)시 불일치금액이 존재합니다. 확인하여주세요");
                c.note("□ 무형자산(잔여상각액 vs 무형자산계정) 마감일의 대사작업이 완료되었습니다. 불일치 금액이 " + list.size() + "건 존재합니다. (체크일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) c.note(ledgerLine(nf, d));
                if (errReturn) return false;
            }
        }

        // 9. 전표미발생 계정과목 체크
        if (!noteCheck(c, errReturn, mapper.selectNoSlipAccount(param),
                "전표내역 중 전표미발생계정(상위레벨)이 존재합니다. 변경해주세요 ", "□ 전표내역 중 전표미발생계정(상위레벨) ")) return false;
        // 9-1. 미사용 계정과목 체크
        if (!noteCheck(c, errReturn, mapper.selectNoUseAccount(param),
                "계정원장에 미사용 계정과목이 존재합니다. 정리해주세요 ", "□ 미사용 계정과목 ")) return false;
        // 9-2. 계정과목 미존재 (금액만 존재하는 경우)
        if (!noteCheck(c, errReturn, mapper.selectNoneAccount(param),
                "분개장에 계정과목이 없는 금액이 존재합니다. 정리해주세요 ", "□ 계정과목 누락 ")) return false;

        // 10. 펀드보수 대사 (ICAM vs AssetERP) — 사무수탁사(회사 1)와 운용사의 SQL이 다르다
        if (yes(chk.fundFeeMatchYn())) {
            List<CloseDiffRes> list = companyId == 1L ? mapper.selectFeeBookDiff(param) : mapper.selectFeeBookDiff2(param);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 펀드보수(ICAM vs AssetERP) 대사작업이 완료되었습니다. 차이금액이 없습니다. (처리일시 : " + now() + ")");
            } else {
                c.fail("펀드보수(ICAM vs AssetERP) 불일치금액이 존재합니다. 확인하여주세요");
                c.note("□ 펀드보수(ICAM vs AssetERP) 마감일의 대사작업이 완료되었습니다. 불일치금액이 " + list.size() + "건 존재합니다. (처리일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) {
                    c.note("  => " + s(d.corpName()) + "(" + s(d.corpCode()) + ") : " + s(d.fundCode()) + " " + s(d.fundName()) + " - "
                            + "ICAM " + nf.format(d.icamFee() == null ? 0d : d.icamFee()) + " | "
                            + "AssetERP " + nf.format(d.forFee() == null ? 0d : d.forFee()) + " | "
                            + "차이금액 " + nf.format(n(d.diffFee())) + s(d.note()));
                }
                if (errReturn) return false;
            }
        }

        // 11. 펀드보수 결산처리여부 체크 — 2022-12-31부터 필수(그 전 마감일은 실패해도 계속)
        if (yes(chk.fundFeeEvalYn())) {
            List<CloseDiffRes> list = mapper.selectNoFeeEval(param);
            if (list.isEmpty()) {
                c.status = 1;
                c.note("■ 펀드보수 결산체크가 완료되었습니다. 결산 누락된 펀드보수가 없습니다. (체크일시 : " + now() + ")");
            } else {
                c.fail("결산 누락된 펀드보수가 존재합니다. 확인하여주세요");
                c.note("□ 결산누락 펀드보수 " + list.size() + "건 존재합니다. (체크일시 : " + now() + ")");
            }
            if (c.status != 1) {
                for (CloseDiffRes d : list) c.note("  => " + s(d.corpName()));
                if (errReturn && closeDate.compareTo(FEE_CHECK_FROM) >= 0) return false;
            }
        }

        // 12. 미승인 전표여부 체크
        if (yes(chk.unfixYn())) {
            long cnt = mapper.selectUnFixCount(param);
            if (cnt == 0) {
                c.status = 1;
                c.note("■ 미승인 전표 체크가 완료되었습니다. 미승인 전표가 없습니다. (체크일시 : " + now() + ")");
            } else {
                c.fail("미승인 전표가 존재합니다. 확인하여주세요");
                c.note("□ 미승인 전표 " + cnt + "건이 존재합니다. (체크일시 : " + now() + ")");
            }
            if (c.status != 1 && errReturn) return false;
        }
        return true;
    }

    /** 9·9-1·9-2: 없으면 status 1(메모 없음), 있으면 실패 + 요약 + "  => note" 줄 */
    private boolean noteCheck(Ctx c, boolean errReturn, List<CloseDiffRes> list, String failMsg, String headPrefix) {
        if (list.isEmpty()) {
            c.status = 1;
            return true;
        }
        c.fail(failMsg);
        c.note(headPrefix + list.size() + "건 존재합니다. (체크일시 : " + now() + ")");
        for (CloseDiffRes d : list) c.note("  => " + s(d.note()));
        return !errReturn;
    }

    private static String ledgerLine(NumberFormat nf, CloseDiffRes d) {
        return "  => " + s(d.accountCode()) + " " + s(d.accountName())
                + " (보유원장 " + nf.format(n(d.drTodayBalAmt()))
                + " / 계정원장 " + nf.format(n(d.crTodayBalAmt()))
                + " / 차이금액 " + nf.format(n(d.drTodayDiffAmt())) + ")";
    }

    /** dbConfig.getDateTimeFormat(new Date()) — 서버 현재 시각 */
    private static String now() {
        return LocalDateTime.now().format(DATE_TIME);
    }

    private static boolean yes(String v) {
        return "true".equals(v);
    }

    private static long n(Long v) {
        return v == null ? 0L : v;
    }

    private static String s(String v) {
        return v == null ? "" : v;
    }

    private BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}
