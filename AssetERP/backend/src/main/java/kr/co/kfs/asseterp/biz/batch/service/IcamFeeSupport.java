package kr.co.kfs.asseterp.biz.batch.service;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFee;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFeeBook;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFeeMapper;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

/** icamOfficeMngFee(SB24)·icamFundMngFee(SB25)가 함께 쓰는 기간 결정·행 변환·입금계좌 생성 */
@Component
@RequiredArgsConstructor
public class IcamFeeSupport {

    private final BatchCommonMapper commonMapper;
    private final BatchFeeMapper feeMapper;

    /** 조회기간: 없으면 (전영업일 ~ 어제), 있으면 startDate·closeDate. 형식 오류는 거절(AS-IS는 NPE) */
    public LocalDate[] resolvePeriod(BatchReq req) {
        if (req.startDate() == null || req.startDate().isEmpty()) {
            LocalDate start = commonMapper.selectBizDate(0L, LocalDate.now(), "-1");
            if (start == null) {
                throw new BusinessException(ErrorCode.INTERNAL_ERROR, "기준시작일(전영업일)을 구할 수 없습니다.");
            }
            return new LocalDate[]{start, LocalDate.now().minusDays(1)};
        }
        try {
            return new LocalDate[]{LocalDate.parse(req.startDate()), LocalDate.parse(req.closeDate())};
        } catch (DateTimeParseException | NullPointerException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT,
                    "startDate·closeDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.startDate() + " ~ " + req.closeDate(), e);
        }
    }

    public BatchIcamFee toFee(IcamRow r, Long companyId, String worker) {
        return new BatchIcamFee(companyId, r.getDate("icam10_std_date"), r.getString("icam10_icam_company_cd"),
                r.getString("icam10_icam_company_nm"), r.getString("icam10_fee_type"), r.getString("icam10_rmk_cd"),
                r.getString("icam10_rmk_nm"), r.getString("icam10_drcr_type"), r.getString("icam10_fund_cd"),
                r.getString("icam10_fund_nm"), r.getDecimal("icam10_fee"), r.getString("icam10_cur_cd"),
                r.getDecimal("icam10_fx_rate"), r.getDate("icam10_af_pay_date"), r.getDate("icam10_bf_pay_date"),
                r.getString("icam10_consignment_cd"), r.getString("icam10_consignment_nm"), worker);
    }

    public BatchIcamFeeBook toFeeBook(IcamRow r, Long companyId, String worker) {
        return new BatchIcamFeeBook(companyId, r.getString("icam12_icam_company_cd"), r.getString("icam12_icam_company_nm"),
                r.getDate("icam12_std_date"), r.getString("icam12_fund_cd"), r.getString("icam12_fund_nm"),
                r.getString("icam12_cur_cd"), r.getDecimal("icam12_for_fee"), r.getDecimal("icam12_fee"),
                r.getString("icam12_consignment_cd"), r.getString("icam12_consignment_nm"), worker);
    }

    /** 펀드보수 입금계좌 생성(신규펀드만): 기준일 이전 시작분이 없으면 기준일 시작으로 만든다(계좌·비고 없음) */
    public void ensureFeeDeposit(BatchIcamFee fee) {
        if (feeMapper.countFeeDeposit(fee.companyId(), fee.icamCompanyCode(), fee.fundCode(), fee.stdDate()) == 0) {
            feeMapper.insertFeeDeposit(fee.companyId(), fee.icamCompanyCode(), fee.fundCode(), fee.stdDate());
        }
    }
}
