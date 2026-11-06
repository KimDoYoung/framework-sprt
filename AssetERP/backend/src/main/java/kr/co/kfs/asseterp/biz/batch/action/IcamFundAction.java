package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFund;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIcamMapper;
import kr.co.kfs.asseterp.biz.batch.service.AssetErpFundSync;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.icamFund (L1126) — ICAM 펀드정보를 회사별·날짜별로 읽어 icam03_fund에 넣고(지우고 넣기),
 * Asset-ERP 펀드(fnd01·fnd02)에 반영하고, 수탁사·수탁은행·사무수탁사 코드를 채운다.
 * 날짜: 직전 영업일 ~ 어제(달력의 모든 날). companyId=ALL이면 모든 ICAM 회사('%').
 * 한 트랜잭션: 하나라도 실패하면 모두 되돌리고 AS-IS 문구(errMsg / 원인)로 알린다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamFundAction implements BatchAction {

    private static final String QUERY = "icam03_fund.selectIcamFund";

    private final BatchCommonMapper commonMapper;
    private final BatchIcamMapper icamMapper;
    private final IcamReader icamReader;
    private final AssetErpFundSync fundSync;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "icamFund";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 펀드정보 가져오기 시작 (icamFund) companyId={}, worker={}", req.companyId(), req.worker());

        String companyId = "ALL".equals(req.companyId()) ? "%" : req.companyId();
        LocalDate today = LocalDate.now();
        LocalDate startDate = commonMapper.selectBizDate(0L, today, "-1");
        LocalDate closeDate = today.minusDays(1);

        String errMsg = "";
        try {
            for (BatchIcamCompany company : icamMapper.selectIcamCompanies(companyId)) {
                log.debug("ICAM 회사코드: {}", company.icamCompanyCode());
                errMsg = "1 ICAM 회사코드 : " + company.icamCompanyCode();

                // 전영업일 ~ 전일
                List<LocalDate> days = startDate == null ? List.of() : icamMapper.selectCalendarDays(startDate, closeDate);
                for (LocalDate day : days) {
                    Map<String, Object> param = new HashMap<>();
                    param.put("icamCompanyCode", company.icamCompanyCode());
                    param.put("stdDate", day.toString());

                    errMsg = "2 ICAM Data GET! 실패 - param:" + param;
                    List<IcamRow> rows = icamReader.read(IcamServer.ICAM, QUERY, param);

                    if (rows.isEmpty()) {
                        noticeLog.notice(actionCode(), "icamFundList(icam03) size : 0 ", param.toString());
                    }
                    errMsg = "3 ICAM Data GET! 실패 - param:" + param + ", size : " + rows.size();

                    for (IcamRow r : rows) {
                        BatchIcamFund fund = toFund(r, req.worker(), day);
                        errMsg = "5 icam03 delete,insert 실패 - companyCode:" + fund.icamCompanyCode() + ", fundCode:" + fund.fundCode();
                        icamMapper.deleteIcamFund(fund);
                        icamMapper.insertIcamFund(fund);

                        // AS-IS: worker가 batch일 때만 하던 조건은 주석 처리되어 항상 fnd01·fnd02까지 반영한다
                        fundSync.sync(company.companyId(), fund, true);
                    }
                }

                errMsg = "수탁사(fnd03) 정보생성 실패 - param:{companyId=" + company.companyId() + ", icamCompanyCode=" + company.icamCompanyCode() + "}";
                icamMapper.insertConsignments(company.companyId(), company.icamCompanyCode());
                errMsg = "수탁은행(fnd09) 정보생성 실패 - param:{companyId=" + company.companyId() + ", icamCompanyCode=" + company.icamCompanyCode() + "}";
                icamMapper.insertTrustBanks(company.companyId(), company.icamCompanyCode());
                errMsg = "사무수탁사(fnd06) 정보생성 실패 - param:{companyId=" + company.companyId() + ", icamCompanyCode=" + company.icamCompanyCode() + "}";
                icamMapper.insertOfficeWorks(company.companyId(), company.icamCompanyCode());
            }
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, errMsg + " / " + e.getMessage(), e);
        }
        return "FUND 작업완료..commit";
    }

    /** ICAM 한 행(AS-IS SELECT 별칭) → icam03 한 건. 기준일은 AS-IS 쿼리가 요청 날짜를 그대로 돌려주므로, 열이 없으면(CSV) 요청한 날(day)을 쓴다. 운용부서(oprDept)는 AS-IS처럼 채우지 않는다. */
    static BatchIcamFund toFund(IcamRow r, String worker, LocalDate day) {
        return new BatchIcamFund(
                r.getString("icam03_icam_company_cd"), r.getString("icam03_icam_company_nm"), r.getDate("icam03_std_date") == null ? day : r.getDate("icam03_std_date"),
                r.getString("icam03_fund_cd"), r.getString("icam03_fund_nm"), r.getString("icam03_fund_full_nm"),
                r.getString("icam03_kofia_fund_cd"), r.getString("icam03_trust_cd"), r.getString("icam03_fund_type_cd"),
                r.getString("icam03_public_cd"), r.getString("icam03_parent_cd"), r.getString("icam03_class_type_cd"),
                r.getString("icam03_fund_unit_cd"), r.getString("icam03_char_class_cd"),
                r.getDate("icam03_set_date"), r.getDate("icam03_end_date"), r.getDate("icam03_end_expect_date"),
                r.getString("icam03_operator1"), r.getString("icam03_operator2"), null,
                r.getString("icam03_consignment_cd"), r.getString("icam03_consignment_nm"),
                r.getString("icam03_trust_bank_cd"), r.getString("icam03_trust_bank_nm"),
                r.getString("icam03_office_work_cd"), r.getString("icam03_office_work_nm"),
                r.getString("icam03_cur"), r.getDate("icam03_close_date"), r.getDate("icam03_fee_date"),
                worker, r.getString("icam03_ksd_fund_cd"), r.getString("icam03_ksd_item_cd"),
                r.getDecimal("icam03_management_rate"), r.getDecimal("icam03_sales_rate"),
                r.getDecimal("icam03_consignment_rate"), r.getDecimal("icam03_office_work_rate"),
                r.getDecimal("icam03_set_amt"), r.getDecimal("icam03_nav"), r.getString("icam03_diff_div_yn"));
    }
}
