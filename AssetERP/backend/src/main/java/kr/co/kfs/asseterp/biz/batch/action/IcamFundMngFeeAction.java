package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFee;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFeeMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIcamMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.batch.service.IcamFeeSupport;
import kr.co.kfs.asseterp.biz.icam.reader.IcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.icamFundMngFee (L3324) — 운용보수 분개(uzm0ac 20402·24923)와 말일 보수잔액을 회사(A1)마다 ICAM에서 읽어
 * icam10_fee·icam12_fee_book에 넣고, 신규 펀드의 입금계좌를 만든 뒤 보수원장 → 보수인출 거래·회계 → 예금원장정리 DB 함수를 부른다.
 * AS-IS는 회사마다 commit하므로 TOBE도 회사마다 트랜잭션을 나눈다(한 회사가 실패해도 앞 회사 결과는 남는다).
 * 사무관리보수와 달리 세 함수가 'Y'가 아니어도 실패시키지 않고 알림 로그만 남긴다(AS-IS 주석 처리된 throw).
 */
@Slf4j
@Component
public class IcamFundMngFeeAction implements BatchAction {

    private static final String Q_FEE = "icam10_fee.selectFundMngFeeIcamData";
    private static final String Q_BOOK = "icam12_fee_book.selectLastDayFeeIcamData";
    private static final String FEE_TYPE = "20402";   // 미지급운용보수

    private final BatchIcamMapper icamMapper;
    private final BatchFeeMapper feeMapper;
    private final IcamFeeSupport feeSupport;
    private final IcamReader icamReader;
    private final BatchNoticeLogService noticeLog;
    private final TransactionTemplate tx;

    public IcamFundMngFeeAction(BatchIcamMapper icamMapper, BatchFeeMapper feeMapper, IcamFeeSupport feeSupport,
                                IcamReader icamReader, BatchNoticeLogService noticeLog, PlatformTransactionManager txManager) {
        this.icamMapper = icamMapper;
        this.feeMapper = feeMapper;
        this.feeSupport = feeSupport;
        this.icamReader = icamReader;
        this.noticeLog = noticeLog;
        this.tx = new TransactionTemplate(txManager);
    }

    @Override
    public String actionCode() {
        return "icamFundMngFee";
    }

    @Override
    public String run(BatchReq req) {
        log.info("ICAM 펀드운용보수분개 가져오기 시작 (icamFundMngFee) companyId={}, worker={}", req.companyId(), req.worker());

        LocalDate[] period = feeSupport.resolvePeriod(req);
        LocalDate startDate = period[0];
        LocalDate closeDate = period[1];
        String companyId = "ALL".equals(req.companyId()) ? "%" : req.companyId();

        try {
            for (BatchIcamCompany company : icamMapper.selectIcamCompaniesA1(companyId)) {
                tx.executeWithoutResult(status -> processCompany(company, req, startDate, closeDate));
            }
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage(), e);
        }
        return "운용보수분개 가져오기 작업완료..commit";
    }

    private void processCompany(BatchIcamCompany company, BatchReq req, LocalDate startDate, LocalDate closeDate) {
        Long cid = company.companyId();
        log.debug("회사ID {} ICAM 회사코드 {}", cid, company.icamCompanyCode());

        Map<String, Object> param = new HashMap<>();
        param.put("companyId", cid);
        param.put("startDate", startDate.toString());
        param.put("closeDate", closeDate.toString());
        param.put("icamCompanyCode", company.icamCompanyCode());
        param.put("fundCode", "%");
        param.put("feeType", FEE_TYPE);

        // 처리 전 정리
        feeMapper.deleteFundMngFee(cid, startDate, closeDate, "%");
        feeMapper.deleteFeeBook(cid, startDate, closeDate);

        List<IcamRow> fees = icamReader.read(IcamServer.ICAM, Q_FEE, param);
        List<IcamRow> books = icamReader.read(IcamServer.ICAM, Q_BOOK, param);
        if (fees.isEmpty()) {
            noticeLog.notice(actionCode(), "icamFundMngFeeList(icam10) data size : 0 ", param.toString());
        }

        // 1. 발생내역 → icam10_fee (+ 신규 펀드 입금계좌)
        for (IcamRow r : fees) {
            BatchIcamFee fee = feeSupport.toFee(r, cid, req.worker());
            feeMapper.insertFee(fee);
            feeSupport.ensureFeeDeposit(fee);
        }
        // 1-1. 말일 보수잔액 → icam12_fee_book
        for (IcamRow r : books) {
            feeMapper.insertFeeBook(feeSupport.toFeeBook(r, cid, req.worker()));
        }

        // 2. 보수원장 생성 / 3. 보수인출 거래·회계 / 4. 예금원장정리 — 'Y'가 아니면 알림만
        String msg = feeMapper.createFundFeeBook(cid, startDate);
        if (!"Y".equals(msg)) {
            noticeLog.notice(actionCode(), "error", "2-err. 펀드운용보수원장 생성 중 오류..." + msg);
        }
        msg = feeMapper.createFundFeeRcvTr(cid, startDate);
        if (!"Y".equals(msg)) {
            noticeLog.notice(actionCode(), "error", "3-err. 보수인출 거래생성 및 회계처리 중 오류..." + msg);
        }
        msg = feeMapper.createDepositBook(cid, startDate);
        if (!"Y".equals(msg)) {
            noticeLog.notice(actionCode(), "error", "4-err. 예금원장정리 중 오류..." + msg);
        }
    }
}
