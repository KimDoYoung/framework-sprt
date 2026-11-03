package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFeeChargeMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 최저보수 청구 Biz20_Tab_FeeCharge (EE21) — AS-IS server/biz/Biz20_FeeCharge 서비스.
 * <p>자료생성({@link #batch})의 <b>ICAM 발생보수 구간은 옮기지 않았다</b>: 발생보수·최초업무시작일을 ICAM 외부 DB(DatabaseFactoryICAM/ICAM2,
 * 테이블 uzm0cd·szm0fd·szx0dt·szx0aa)에서 읽는데 asseterpdb 에 없다(사용자 결정 2026-11-03). 그래서 biz21 보수상세가 만들어지지 않아
 * 구간 발생보수는 0이고, 최저보수·병행보수·청구보수는 그 값으로 AS-IS 식 그대로 계산된다.</p>
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizFeeChargeService {

    private final BizFeeChargeMapper mapper;
    private final SysFileService sysFileService;

    // ── 목록·한 건 ──

    /** biz.Biz20_FeeCharge.selectByChargeDate (L35) — 검색어는 '%…%' */
    public List<BizFeeChargeRes> search(UserPrincipal user, LocalDate chargeDate, String searchText) {
        return mapper.selectByChargeDate(user.getCompanyId(), chargeDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** biz20_fee_charge.selectById — 수정창 저장 뒤 한 건 */
    public BizFeeChargeDetailRes get(UserPrincipal user, Long feeChargeId) {
        BizFeeChargeDetailRes r = mapper.selectById(user.getCompanyId(), feeChargeId);
        if (r == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "최저보수 청구정보를 찾을 수 없습니다.");
        }
        return r;
    }

    /** getSeq (dbConfig.getSeq → f_create_seq()) */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    // ── 편집창 Biz20_Edit_FeeCharge ──

    /** biz.Biz20_FeeCharge.updateCheck (L807) — 같은 운용사·청구일자에 다른 행이 몇 개 있는지(0이면 저장해도 된다) */
    public int sameCorpCount(UserPrincipal user, Long feeChargeId, Long corpId, LocalDate chargeDate) {
        return mapper.countSameCorp(user.getCompanyId(), feeChargeId == null ? -1L : feeChargeId, corpId, chargeDate);
    }

    /** biz.Biz20_FeeCharge.modelUpdate (L842) — 번호가 이미 있으면 UPDATE, 없으면 INSERT. 청구보수가 비었거나 0이면 청구대상 아님 */
    @Transactional
    public BizFeeChargeDetailRes save(UserPrincipal user, BizFeeChargeSaveReq req) {
        if (req.feeChargeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "청구보수ID가 없습니다.");
        }
        if (req.corpId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "운용사는 필수선택 항목입니다");
        }
        if (req.contCorpId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "계약사관리ID가 null입니다. 전산팀에 문의하세요");
        }
        String targetYn = req.chargeFee() == null || req.chargeFee() == 0 ? "false" : "true";
        if (mapper.countById(user.getCompanyId(), req.feeChargeId()) > 0) {
            mapper.updateFeeCharge(user.getCompanyId(), req, targetYn);
        } else {
            mapper.insertFeeCharge(user.getCompanyId(), req, targetYn);
        }
        return get(user, req.feeChargeId());
    }

    // ── 삭제·확정·상신 ──

    /** biz.Biz20_FeeCharge.deleteList (L851) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> feeChargeIds) {
        int n = 0;
        for (Long id : feeChargeIds) {
            n += mapper.deleteByFeeChargeId(user.getCompanyId(), id);
        }
        return n;
    }

    /** biz.Biz20_FeeCharge.confirmUpdate (L818) → 바꾼 건수 */
    @Transactional
    public int confirm(UserPrincipal user, BizFeeChargeConfirmReq req) {
        int n = 0;
        for (Long id : req.feeChargeIds()) {
            n += mapper.confirmUpdate(user.getCompanyId(), id, String.valueOf(req.fixYn()));
        }
        return n;
    }

    /** biz.Biz20_FeeCharge.apprCheck (L796) — 입금계좌가 있어야 한 건이 나온다(없으면 빈 목록) */
    public List<BizFeeChargeApprRes> apprCheck(UserPrincipal user, Long feeChargeId) {
        return mapper.selectHtmlContent(user.getCompanyId(), feeChargeId);
    }

    /**
     * biz.Biz20_FeeCharge.updateApprId (L833) — 개별 상신(A18·A19) 뒤 결재문서 ID 기록.
     * 문서의 첨부 자동등록 `copyFileLine`(Apr01_Edit_ApprDoc L2785-2787 → Sys10_File.copyFile)도 같이 한다 —
     * AS-IS 는 문서를 저장할 때 청구보수의 첨부파일을 결재문서에 연결하고, TOBE 는 문서 ID 가 정해지는 이 때 한다(이미 연결된 파일은 다시 넣지 않는다)
     */
    @Transactional
    public int updateApprId(UserPrincipal user, Long feeChargeId, Long apprId) {
        if (feeChargeId == null || apprId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재문서 정보가 없습니다.");
        }
        int n = mapper.updateApprId(user.getCompanyId(), feeChargeId, apprId);
        if (n == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "최저보수 청구정보를 찾을 수 없습니다.");
        }
        for (Long fileId : mapper.selectFileIds(feeChargeId)) {
            if (mapper.countApprRelateFile(fileId, apprId) == 0) {
                mapper.insertApprRelateFile(mapper.selectNextId(), fileId, apprId);
            }
        }
        return n;
    }

    /**
     * [파일 일괄 다운로드] FileDownload?fileType=feeCharge (downloadFeeChargeZip L315-344) — 그 분기 청구 목록(검색어 '%')의 행마다 청구보수 ID 의 첨부를 모아 zip 하나로.
     * 파일이 하나도 없으면 공통 zip 처리와 같이 "파일 리스트가 없습니다."(AS-IS 는 빈 zip 을 내려 준다)
     */
    public List<SysFileService.StoredFile> zipEntries(UserPrincipal user, LocalDate chargeDate) {
        List<Long> fileIds = new java.util.ArrayList<>();
        for (BizFeeChargeRes r : mapper.selectByChargeDate(user.getCompanyId(), chargeDate, "%")) {
            if (r.realFeeChargeId() != null) {
                fileIds.addAll(mapper.selectFileIds(r.realFeeChargeId()));
            }
        }
        return sysFileService.getZipEntries(user, fileIds);
    }

    // ── 구간 계산 상세 ──

    /** biz.Biz22_FeeChargeCalc.selectByContCorpId */
    public List<BizFeeChargeCalc> calcs(UserPrincipal user, Long contCorpId, LocalDate chargeDate) {
        return mapper.selectCalcs(user.getCompanyId(), contCorpId, chargeDate);
    }

    // ── 출력/다운로드 ──

    /** Sys99_Print 에 담는 창 이름 (RD Biz20_Rd_FeeCharge 가 읽는다) */
    private static final String PRINT_WINDOW = "Biz20_Tab_FeeCharge";

    /** sys.Sys99_Print.insertRdFeeCharge (L1064-1107) — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과(selectByChargeDate)를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 의 rdGroupId) */
    @Transactional
    public String rdPrint(UserPrincipal user, LocalDate chargeDate, String searchText) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, PRINT_WINDOW);
        for (BizFeeChargeRes r : mapper.selectByChargeDate(companyId, chargeDate, "%" + (searchText == null ? "" : searchText) + "%")) {
            mapper.insertPrint(mapper.selectNextId(), companyId, personId, PRINT_WINDOW, groupId, r);
        }
        return String.valueOf(groupId);
    }

    // ── 자료생성 biz.Biz20_FeeCharge.createFeeCharge (L40-427) ──

    /**
     * 분기 청구자료를 만든다(기존 자료는 지우고 다시). contCorpId 가 있으면 그 계약사만. 확정된 청구는 대상에서 빠진다.
     * AS-IS 는 실패 때 result.fail 로 돌려보내는데, TOBE 는 예외로 전체를 되돌린다. → 처리한 계약사 수
     */
    @Transactional
    public int batch(UserPrincipal user, LocalDate chargeDate, Long contCorpId) {
        Long companyId = user.getCompanyId();
        LocalDate startDate = mapper.selectQuarterStartDate(chargeDate, "1");
        LocalDate closeDate = chargeDate;

        // 01. 계약사의 운영정보별 최초업무시작일 체크 및 UPDATE — ICAM 의존이라 옮기지 않았다

        // 02. 계약사별 처리
        List<BizFeeContCorpRow> contCorps = mapper.selectContCorp(companyId, contCorpId, startDate, closeDate);
        for (BizFeeContCorpRow c : contCorps) {
            // 기생성 계산구간정보 삭제
            mapper.deleteCalcByContCorpId(c.contCorpId(), chargeDate);

            // 03. 보수청구건별 기생성내역 정리 (ICAM 발생보수 가져오기는 옮기지 않았다)
            List<BizFeeWithCorpRow> corps = mapper.selectWithCorps(c.contCorpId(), c.feeCalcStartDate(), c.feeCalcCloseDate());
            for (BizFeeWithCorpRow corp : corps) {
                List<BizFeeChargeRow> exist = mapper.selectByCorpId(corp.companyId(), corp.contCorpId(), corp.corpId(), chargeDate);
                Long feeChargeId;
                if (!exist.isEmpty()) {
                    if (isTrue(exist.get(0).fixYn())) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, corp.corpNm() + "의 최저보수 내역이 확정되었습니다. 취소 후 처리하세요.");
                    }
                    feeChargeId = exist.get(0).feeChargeId();
                } else {
                    feeChargeId = mapper.selectNextId();
                    mapper.insertNewCharge(feeChargeId, companyId, chargeDate, corp.corpId(), corp.contCorpId(),
                            c.feeCalcStartDate(), c.feeCalcCloseDate());
                }
                // 기생성 보수상세내역 삭제
                mapper.deleteDtlByFeeChargeId(feeChargeId);

                if (corp.manageType() == null || corp.manageType().isEmpty()) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, corp.corpNm() + "의 운영구분(자산운용/자문/일임) 정보가 없습니다.");
                }
                // ICAM 에서 펀드별 발생보수를 읽어 biz21_fee_charge_dtl 을 만드는 구간 — 옮기지 않았다
            }

            // 10. 계산구간정보 생성
            createCalcTerm(c.contCorpId(), chargeDate, c.feeCalcStartDate(), c.feeCalcCloseDate());

            // 20. 계산구간별 계산정보 UPDATE
            for (BizFeeChargeCalc term : mapper.selectCalcsByContCorp(c.contCorpId(), chargeDate)) {
                calcTerm(term, c, chargeDate);
            }

            // 30. 청구보수(BIZ20) 내역완성
            for (BizFeeChargeRow charge : mapper.selectByContCorpId2(c.contCorpId(), chargeDate)) {
                BizFeeInfoRow info = mapper.selectFeeInfo(c.contCorpId(), chargeDate, charge.manageType());
                mapper.updateFeeCalcInfo(charge.feeChargeId(), c.feeCalcStartDate(), c.feeCalcCloseDate(), c.calcDays(), info);
            }
        }

        // 99. 미등록 보수입금계좌 생성(입금계좌정보는 없이 생성함)
        mapper.insertNotAccount(companyId, chargeDate);
        return contCorps.size();
    }

    /** biz.Biz20_FeeCharge.createCalcTerm (L429-529) — 계약 이력·운영 기간이 바뀌는 날마다 구간을 나누고 구간별 보수정보를 넣는다 */
    private void createCalcTerm(Long contCorpId, LocalDate chargeDate, LocalDate calcStartDate, LocalDate calcCloseDate) {
        // 구간생성: 시작일 내림차순으로 받아 가장 늦은 구간의 종료일은 계산 종료일, 앞 구간의 종료일은 다음 구간 시작일 전날
        LocalDate termCloseDate = calcCloseDate;
        List<LocalDate> termStartDates = mapper.selectTermStartDates(contCorpId, calcStartDate, calcCloseDate);
        for (LocalDate termStartDate : termStartDates) {
            mapper.insertCalcTerm(contCorpId, chargeDate, termStartDate, termCloseDate);
            termCloseDate = termStartDate.minusDays(1);
        }

        // 최종업무종료일 이후 구간 제거 (원본 SQL 에 없던 계약사·청구일자 조건을 더했다 — 매퍼 주석)
        mapper.deleteTermLastCloseDate(contCorpId, chargeDate);

        // 자동연장(3)인 경우 구간 제거: 앞 구간의 종료일을 지운 구간의 종료일로 늘린다
        if (termStartDates.size() > 1) {
            int cnt = 1;
            Long preTermKeyId = null;
            for (BizFeeChargeCalc term : mapper.selectCalcsByContCorp(contCorpId, chargeDate)) {
                if (cnt > 1) {
                    String statusCd = mapper.selectContStatusByStartDate(contCorpId, term.termStartDate);
                    if ("3".equals(statusCd)) {
                        mapper.deleteCalcById(term.feeChargeCalcId);
                        mapper.updateTermCloseDate(preTermKeyId, term.termCloseDate);
                    } else {
                        preTermKeyId = term.feeChargeCalcId;
                    }
                } else {
                    preTermKeyId = term.feeChargeCalcId;
                }
                cnt++;
            }
        }

        // 구간별 보수정보 UPDATE
        for (BizFeeChargeCalc term : mapper.selectCalcsByContCorp(contCorpId, chargeDate)) {
            BizFeeHistoryRow h = mapper.selectHistoryByDate(contCorpId, term.termStartDate);
            if (h == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "계약사(" + contCorpId + ")의 " + term.termStartDate + " 보수정보가 없습니다.");
            }
            term.minFeeYn = h.minFeeYn();
            if (isTrue(term.minFeeYn)) {
                term.manageMinFee = h.manageMinFee();
                term.advMinFee = h.advMinFee();
                term.discrMinFee = h.discrMinFee();
            } else {
                term.manageMinFee = 0L;
                term.advMinFee = 0L;
                term.discrMinFee = 0L;
            }
            term.withYn = h.withYn();
            term.withFee = isTrue(term.withYn) ? h.withFee() : 0L;
            mapper.updateCalcFeeInfo(term);
        }
    }

    /** createFeeCharge 20 — 구간 하나의 운용/자문/일임 발생·최저·병행·청구 보수를 계산해 저장 (L198-331) */
    private void calcTerm(BizFeeChargeCalc t, BizFeeContCorpRow c, LocalDate chargeDate) {
        normalize(t);
        double ratio = t.termDays * 1.0 / c.calcDays();   // 구간일수 / 청구기간일수

        // 운영별(운용/자문/일임) 발생보수·최저보수 SET
        List<BizFeeWithCorpRow> withCorps = mapper.selectWithCorps(c.contCorpId(), t.termStartDate, t.termCloseDate);
        for (BizFeeWithCorpRow corp : withCorps) {
            Long sum = mapper.selectOccFeeSum(corp.contCorpId(), corp.corpId(), chargeDate, t.termStartDate, t.termCloseDate);
            long occFee = sum == null ? 0L : sum;
            if ("1".equals(corp.manageType())) {
                t.manageTermOccFee = occFee;
                t.manageTermMinFee = (long) (t.manageMinFee * ratio);
            } else if ("2".equals(corp.manageType())) {
                t.advTermOccFee = occFee;
                t.advTermMinFee = (long) (t.advMinFee * ratio);
            } else if ("3".equals(corp.manageType())) {
                t.discrTermOccFee = occFee;
                t.discrTermMinFee = (long) (t.discrMinFee * ratio);
            }
        }

        // 병행적용여부: 운영이 하나뿐이면 병행 아님
        if (isTrue(t.withYn) && withCorps.size() == 1) {
            t.withYn = "false";
        }
        // 병행보수
        if (isTrue(t.withYn)) {
            t.withTermWithFee = (long) (t.withFee * ratio);
            t.withTermOccFee = t.manageTermOccFee + t.advTermOccFee + t.discrTermOccFee;
            t.withTermChargeFee = t.withTermWithFee - t.withTermOccFee;
        }

        // 최저보수합계(minFeeSum): (최저보수 > 발생보수)인 운영의 연 최저보수만 더한다
        long minFeeSum = 0L;
        if (t.manageTermMinFee > t.manageTermOccFee) {
            minFeeSum += t.manageMinFee;
        }
        if (t.advTermMinFee > t.advTermOccFee) {
            minFeeSum += t.advMinFee;
        }
        if (t.discrTermMinFee > t.discrTermOccFee) {
            minFeeSum += t.discrMinFee;
        }

        t.manageTermWithFee = 0L;
        t.advTermWithFee = 0L;
        t.discrTermWithFee = 0L;
        boolean with = isTrue(t.withYn);

        // 운용-청구보수: (최저보수 > 발생보수)이면 청구대상
        if (t.manageTermMinFee > t.manageTermOccFee) {
            if (with) {
                if (t.withTermChargeFee < 0) {   // 병행보수청구금액이 '-'이면 청구대상 아님
                    t.manageTermChargeFee = 0L;
                } else {
                    t.manageTermWithFee = (long) (t.withTermChargeFee * (t.manageMinFee * 1.0 / minFeeSum));
                    t.manageTermChargeFee = t.manageTermWithFee;
                }
            } else {
                t.manageTermChargeFee = t.manageTermMinFee - t.manageTermOccFee;
            }
        } else {
            t.manageTermChargeFee = 0L;
        }

        // 자문-청구보수
        if (t.advTermMinFee > t.advTermOccFee) {
            if (with) {
                if (t.withTermChargeFee < 0) {   // 병행보수청구금액이 '-'이면 발생금액만 청구
                    t.advTermChargeFee = t.advTermOccFee;
                } else {
                    t.advTermWithFee = (long) (t.withTermChargeFee * (t.advMinFee * 1.0 / minFeeSum));
                    t.advTermChargeFee = t.advTermOccFee + t.advTermWithFee;
                }
            } else {
                t.advTermChargeFee = t.advTermMinFee;
            }
        } else {
            t.advTermChargeFee = t.advTermOccFee;
        }

        // 일임-청구보수
        if (t.discrTermMinFee > t.discrTermOccFee) {
            if (with) {
                if (t.withTermChargeFee < 0) {
                    t.discrTermChargeFee = t.discrTermOccFee;
                } else {
                    t.discrTermWithFee = (long) (t.withTermChargeFee * (t.discrMinFee * 1.0 / minFeeSum));
                    t.discrTermChargeFee = t.discrTermOccFee + t.discrTermWithFee;
                }
            } else {
                t.discrTermChargeFee = t.discrTermMinFee;
            }
        } else {
            t.discrTermChargeFee = t.discrTermOccFee;
        }

        mapper.updateCalcFeeInfo(t);
    }

    /** DB 에서 null 로 온 보수 열을 0으로 (AS-IS 는 null 이면 NPE 나는 자리) */
    private static void normalize(BizFeeChargeCalc t) {
        t.termDays = nz(t.termDays);
        t.manageMinFee = nz(t.manageMinFee);
        t.manageTermMinFee = nz(t.manageTermMinFee);
        t.manageTermOccFee = nz(t.manageTermOccFee);
        t.manageTermWithFee = nz(t.manageTermWithFee);
        t.manageTermChargeFee = nz(t.manageTermChargeFee);
        t.advMinFee = nz(t.advMinFee);
        t.advTermMinFee = nz(t.advTermMinFee);
        t.advTermOccFee = nz(t.advTermOccFee);
        t.advTermWithFee = nz(t.advTermWithFee);
        t.advTermChargeFee = nz(t.advTermChargeFee);
        t.discrMinFee = nz(t.discrMinFee);
        t.discrTermMinFee = nz(t.discrTermMinFee);
        t.discrTermOccFee = nz(t.discrTermOccFee);
        t.discrTermWithFee = nz(t.discrTermWithFee);
        t.discrTermChargeFee = nz(t.discrTermChargeFee);
        t.withFee = nz(t.withFee);
        t.withTermWithFee = nz(t.withTermWithFee);
        t.withTermOccFee = nz(t.withTermOccFee);
        t.withTermChargeFee = nz(t.withTermChargeFee);
    }

    private static Long nz(Long v) {
        return v == null ? 0L : v;
    }

    private static boolean isTrue(String yn) {
        return "true".equals(yn);
    }
}
