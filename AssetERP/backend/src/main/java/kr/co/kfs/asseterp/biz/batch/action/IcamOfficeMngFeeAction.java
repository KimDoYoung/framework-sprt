package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFee;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFeeBook;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFeeMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFundMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.batch.service.IcamFeeSupport;
import kr.co.kfs.asseterp.biz.icam.reader.IcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.icamOfficeMngFee (L3128) — 사무관리보수 분개(uzm0ac 20407·24926)와 말일 보수잔액을 ICAM에서 읽어
 * icam10_fee·icam12_fee_book에 넣는다(한국펀드서비스 회사 1·28000 전용, 계약사관리 운영구분이 '자산운용'인 운용사만).
 * 신규 펀드의 입금계좌·운용사 거래처를 만들고, 보수원장 → 보수인출 거래·회계 → 예금원장정리 DB 함수를 차례로 부른다.
 * 한 트랜잭션, 실패 시 원인 문구만(AS-IS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamOfficeMngFeeAction implements BatchAction {

    private static final String Q_FEE = "icam10_fee.selectOfficeMngFeeIcamData";
    private static final String Q_BOOK = "icam12_fee_book.selectLastDayFeeIcamData";
    private static final String FEE_TYPE = "20407";   // 미지급사무관리보수

    private final BatchFeeMapper feeMapper;
    private final BatchFundMapper fundMapper;
    private final IcamFeeSupport feeSupport;
    private final IcamReader icamReader;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "icamOfficeMngFee";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 사무관리보수분개 가져오기 시작 (icamOfficeMngFee) companyId={}, worker={}", req.companyId(), req.worker());

        Long companyId;
        try {
            companyId = Long.parseLong(req.companyId());
        } catch (NumberFormatException e) {
            // AS-IS는 Long.parseLong 예외가 try 밖이라 서블릿이 죽는다(원본-이상한점 #219)
            throw new BusinessException(ErrorCode.INVALID_INPUT, "companyId가 필요합니다: " + req.companyId());
        }
        if (companyId != 1 && companyId != 28000) {
            // AS-IS는 -1 응답을 쓰고도 계속 진행한다(#219). TOBE는 여기서 멈춘다
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사무관리보수와 해당없는 회사코드입니다. [" + companyId + ']');
        }
        LocalDate[] period = feeSupport.resolvePeriod(req);
        LocalDate startDate = period[0];
        LocalDate closeDate = period[1];

        try {
            Map<String, Object> param = new HashMap<>();
            param.put("companyId", companyId);
            param.put("startDate", startDate.toString());
            param.put("closeDate", closeDate.toString());
            param.put("icamCompanyCode", "%");
            param.put("fundCode", "%");
            param.put("feeType", FEE_TYPE);

            // 처리 전 정리
            feeMapper.deleteOfficeMngFee(companyId, startDate, closeDate);
            feeMapper.deleteFeeBook(companyId, startDate, closeDate);

            List<IcamRow> fees = icamReader.read(IcamServer.ICAM, Q_FEE, param);
            List<IcamRow> books = icamReader.read(IcamServer.ICAM, Q_BOOK, param);

            if (fees.isEmpty()) {
                noticeLog.notice(actionCode(), "icamOfficeMngFeeList(icam10) data size : 0 ", param.toString());
            }
            // 발생내역 → icam10_fee (계약사관리 운영구분 '자산운용'만)
            for (IcamRow r : fees) {
                BatchIcamFee fee = feeSupport.toFee(r, companyId, req.worker());
                if (feeMapper.countManageTypeIs1(companyId, fee.icamCompanyCode(), fee.stdDate()) > 0) {
                    feeMapper.insertFee(fee);
                    feeSupport.ensureFeeDeposit(fee);   // 펀드보수 입금계좌(신규펀드만)
                    // 운용사 거래처등록
                    if (feeMapper.countCorpCode(companyId, fee.icamCompanyCode(), 1L) == 0) {
                        feeMapper.insertManagerCorp(fundMapper.selectSeq(), companyId, fee.icamCompanyName(),
                                fee.icamCompanyCode(), Long.parseLong(fee.icamCompanyCode()));
                    }
                }
            }
            // 말일 보수잔액 → icam12_fee_book
            for (IcamRow r : books) {
                BatchIcamFeeBook book = feeSupport.toFeeBook(r, companyId, req.worker());
                if (feeMapper.countManageTypeIs1(companyId, book.icamCompanyCode(), book.stdDate()) > 0) {
                    feeMapper.insertFeeBook(book);
                }
            }

            // 보수원장 생성 → 보수인출 거래·회계 → 예금원장정리 (하나라도 'Y'가 아니면 전체 실패)
            mustBeY(feeMapper.createFundFeeBook(companyId, startDate));
            mustBeY(feeMapper.createFundFeeRcvTr(companyId, startDate));
            mustBeY(feeMapper.createDepositBook(companyId, startDate));
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "사무관리보수분개 가져오기 작업완료..commit";
    }

    private static void mustBeY(String resultMsg) {
        if (!"Y".equals(resultMsg)) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, resultMsg);
        }
    }
}
