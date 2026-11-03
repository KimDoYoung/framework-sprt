package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.biz.dto.*;
import kr.co.kfs.asseterp.biz.biz.mapper.BizErpFeeChargeMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizErpFeeChargeMapper.ChargeInsert;
import kr.co.kfs.asseterp.biz.biz.mapper.BizErpFeeChargeMapper.ErpFeePeriod;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

/** AssetERP 사용료청구 Biz55_Tab_ErpFeeCharge (EE23) — AS-IS server/biz/Biz55_ErpFeeCharge. KFS 전체 표라 로그인 회사를 쓰지 않는다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizErpFeeChargeService {

    private final BizErpFeeChargeMapper mapper;

    /** biz.Biz55_ErpFeeCharge.selectByStdDate (L40) — 검색어는 "%…%" */
    public List<BizErpFeeChargeRes> search(LocalDate stdDate, String searchText) {
        return mapper.selectByStdDate(stdDate, like(searchText));
    }

    /** biz.Biz51_ErpContCorp.selectErpCompany (L33) — 계약사 조회창. 검색어가 비면 "%" */
    public List<BizErpCompanyRes> companies(LocalDate stdDate, String searchText) {
        return mapper.selectErpCompany(stdDate, like(searchText));
    }

    /** biz.Biz52_ErpFee.selectDefaultData (L42) — 설정이 1건 없으면 null (화면은 "자동계산불가 관리자에게 문의") */
    public BizErpFeeDefaultRes defaultData(Long erpContCorpId, Long companyId, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectDefaultData(erpContCorpId, companyId, startDate, closeDate);
    }

    /** biz.Biz55_ErpFeeCharge.insertUpdate (L260) — 번호가 없으면 새 번호로 INSERT, 있으면 UPDATE. 저장한 행을 다시 읽어 돌려준다 */
    @Transactional
    public BizErpFeeChargeRes save(BizErpFeeChargeSaveReq req) {
        long id = req.erpFeeChargeId() == null ? mapper.selectNextId() : req.erpFeeChargeId();
        BizErpFeeChargeSaveReq r = new BizErpFeeChargeSaveReq(id, req.erpContCorpId(), req.corpNm(), req.chargeDate(), req.startDate(), req.closeDate(),
                req.erpFee(), req.dataFee(), req.smsCount(), req.addSmsFee(), req.serverUsage(), req.addServerFee(), req.userCount(), req.addUserFee(),
                req.etcAmt(), req.etcDesc(), req.totalAmt(), req.totalVat(), req.chargeAmt());
        if (mapper.countById(id) > 0) {
            mapper.updateSaved(r);
        } else {
            mapper.insertSaved(r);
        }
        return mapper.selectById(id);
    }

    /**
     * biz.Biz55_ErpFeeCharge.updateErpCompany (L64) — 고른 계약사마다 청구 한 행을 만든다. 사용료 기간 = 청구계산월 '1'이면 이번 달, 아니면 전월.
     * 사용료 설정이나 청구일이 없는 계약사는 건너뛴다. 문자 건수·서버 사용량·사용 인원은 전월 기준. 만든 건수를 돌려준다
     */
    @Transactional
    public int create(BizErpFeeChargeCreateReq req) {
        YearMonth ym = parseYm(req.dataYm());
        LocalDate stdDate = ym.atDay(1);
        LocalDate startDate = ym.atDay(1);
        LocalDate closeDate = ym.atEndOfMonth();
        LocalDate beforeStartDate = ym.minusMonths(1).atDay(1);
        LocalDate beforeCloseDate = ym.atDay(1).minusDays(1);
        int made = 0;
        for (Long corpId : req.erpContCorpIds()) {
            List<BizErpCompanyRes> found = mapper.selectErpCompanyById(stdDate, corpId);
            if (found.isEmpty()) {
                continue;
            }
            BizErpCompanyRes corp = found.get(0);
            boolean thisMonth = "1".equals(corp.chargeCalcMonthType());
            LocalDate feeStart = thisMonth ? startDate : beforeStartDate;
            LocalDate feeClose = thisMonth ? closeDate : beforeCloseDate;
            ErpFeePeriod fee = mapper.selectFeeByDate(corp.erpContCorpId(), feeStart, feeClose);
            if (fee == null || fee.chargeDay() == null) {
                continue;
            }
            LocalDate chargeDate;
            try {
                // SimpleDateFormat("yyyy.MM.dd")는 느슨해서 31일이 없는 달이면 다음 달로 넘어간다
                chargeDate = ym.atDay(1).plusDays(Integer.parseInt(fee.chargeDay().trim()) - 1L);
            } catch (NumberFormatException e) {
                continue;
            }
            long erpFee = nz(fee.erpFee());
            long dataFee = nz(fee.dataFee());
            long smsCnt = mapper.selectSmsCount(corp.companyId(), beforeStartDate, beforeCloseDate);
            Double usage = mapper.selectServerUsage(corp.companyId(), beforeCloseDate);
            long serverUsage = usage == null ? 0L : usage.longValue();
            long userCnt = mapper.selectPersonCount(corp.companyId(), fee.userCountStdCd());

            long smsAdd = !Boolean.TRUE.equals(fee.addFeeSmsYn()) || nz(fee.smsBaseCount()) >= smsCnt
                    ? 0L : (smsCnt - nz(fee.smsBaseCount())) * nz(fee.smsAddPrice());
            long serverAdd = !Boolean.TRUE.equals(fee.addFeeServerYn()) || nz(fee.serverBaseUsage()) >= serverUsage
                    ? 0L : (((serverUsage - nz(fee.serverBaseUsage())) + nz(fee.serverAddUnit()) - 1) / nz(fee.serverAddUnit())) * nz(fee.serverAddPrice());
            long userAdd = !Boolean.TRUE.equals(fee.addFeeUserYn()) || nz(fee.userBaseCount()) >= userCnt
                    ? 0L : (userCnt - nz(fee.userBaseCount())) * nz(fee.userAddPrice());
            long totalAmt = erpFee + dataFee + smsAdd + serverAdd + userAdd;
            long totalVat = "1".equals(fee.vatCd()) ? (long) (totalAmt * 0.1) : 0L;

            mapper.insertErpFeeCharge(new ChargeInsert(mapper.selectNextId(), chargeDate, feeStart, feeClose, corp.erpContCorpId(),
                    erpFee, dataFee, smsCnt, serverUsage, userCnt, smsAdd, serverAdd, userAdd, 0L, totalAmt, totalVat, totalAmt + totalVat));
            made++;
        }
        return made;
    }

    /** biz.Biz55_ErpFeeCharge.confirmUpdate (L49) — fix_yn 을 'true'/'false' 글자로 */
    @Transactional
    public int confirm(BizErpFeeChargeConfirmReq req) {
        int n = 0;
        for (Long id : req.erpFeeChargeIds()) {
            n += mapper.confirmUpdate(id, String.valueOf(req.fixYn()));
        }
        return n;
    }

    /** biz.Biz55_ErpFeeCharge.updateApprId (L244) */
    @Transactional
    public int updateApprId(BizErpFeeChargeApprReq req) {
        int n = 0;
        for (Long id : req.erpFeeChargeIds()) {
            n += mapper.updateApprId(id, req.apprId());
        }
        return n;
    }

    /** biz.Biz55_ErpFeeCharge.delete (L279) — UpdateDataModel.deleteModel: 확정 여부와 상관없이 선택 행을 지운다(AS-IS 그대로) */
    @Transactional
    public int delete(List<Long> erpFeeChargeIds) {
        int n = 0;
        for (Long id : erpFeeChargeIds) {
            n += mapper.deleteById(id);
        }
        return n;
    }

    private static String like(String text) {
        return text == null ? "%" : "%" + text + "%";
    }

    private static long nz(Long n) {
        return n == null ? 0L : n;
    }

    /** 청구년월 'YYYY.MM' 또는 'YYYY-MM' */
    private static YearMonth parseYm(String dataYm) {
        try {
            return YearMonth.parse(dataYm.trim().replace('.', '-'));
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "청구년월을 확인해주세요.");
        }
    }
}
