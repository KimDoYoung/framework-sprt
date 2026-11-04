package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFundBook;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIcamMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
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
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.icamFundBook (L3034) — ICAM 펀드원장(uzm0uh)을 기간(기본: 3개월 전 ~ 어제)만큼
 * ICAM 회사(자산운용 A1)마다 읽어 icam06_fund_book에 넣는다. 읽기 전에 그 회사의 같은 기간 원장을 먼저 지운다.
 * 한 트랜잭션: 실패하면 지운 것도 되돌리고 원인 문구만 알린다(AS-IS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamFundBookAction implements BatchAction {

    private static final String QUERY = "icam06_fund_book.selectIcamFundBook";

    private final BatchIcamMapper icamMapper;
    private final IcamReader icamReader;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "icamFundBook";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 펀드원장 가져오기 시작 (icamFundBook) companyId={}, worker={}", req.companyId(), req.worker());

        LocalDate startDate;
        LocalDate closeDate;
        if (req.startDate() == null || req.startDate().isEmpty()) {
            closeDate = LocalDate.now().minusDays(1);       // 기준종료일(-1일)
            startDate = closeDate.minusMonths(3);           // 기준시작일(-3개월)
        } else {
            try {
                startDate = LocalDate.parse(req.startDate());
                closeDate = LocalDate.parse(req.closeDate());
            } catch (DateTimeParseException | NullPointerException e) {
                // AS-IS는 파싱 실패를 삼키고 null로 NPE가 난다(원본-이상한점 #212)
                throw new BusinessException(ErrorCode.INVALID_INPUT, "startDate·closeDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.startDate() + " ~ " + req.closeDate());
            }
        }
        String companyId = "ALL".equals(req.companyId()) ? "%" : req.companyId();

        try {
            for (BatchIcamCompany company : icamMapper.selectIcamCompaniesA1(companyId)) {
                log.debug("ICAM 회사코드: {}", company.icamCompanyCode());

                Map<String, Object> param = new HashMap<>();
                param.put("icamCompanyCode", company.icamCompanyCode());
                param.put("companyId", company.companyId());
                param.put("startDate", startDate);
                param.put("closeDate", closeDate);
                param.put("startDateStr", startDate.toString());
                param.put("closeDateStr", closeDate.toString());

                // 처리 전 기준일 원장정리
                icamMapper.deleteFundBook(company.icamCompanyCode(), startDate, closeDate);

                List<IcamRow> rows = icamReader.read(IcamServer.ICAM, QUERY, param);
                if (rows.isEmpty()) {
                    noticeLog.notice(actionCode(), "icamFundBook(icam06) data size : 0 ", param.toString());
                }
                for (IcamRow r : rows) {
                    icamMapper.insertFundBook(new BatchIcamFundBook(company.icamCompanyCode(),
                            r.getDate("icam06_std_date"), r.getString("icam06_fund_cd"), r.getString("icam06_fund_nm"),
                            r.getString("icam06_multi_class_cd"), r.getString("icam06_cur"),
                            r.getDecimal("icam06_set_qty"), r.getDecimal("icam06_set_amt"), r.getDecimal("icam06_principal"),
                            r.getDecimal("icam06_nav"), r.getDecimal("icam06_total_asset"), r.getDecimal("icam06_std_price"),
                            r.getDecimal("icam06_tax_price"), r.getDecimal("icam06_for_set_amt"), r.getDecimal("icam06_for_principal"),
                            r.getDecimal("icam06_for_nav"), r.getDecimal("icam06_for_total_asset"),
                            r.getDecimal("icam06_for_std_price"), r.getDecimal("icam06_for_tax_price"), req.worker()));
                }
            }
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "펀드원장 작업완료..commit";
    }
}
