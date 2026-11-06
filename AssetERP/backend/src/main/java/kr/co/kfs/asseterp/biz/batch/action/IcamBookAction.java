package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchAdvBook;
import kr.co.kfs.asseterp.biz.batch.dto.BatchFndBook;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchAdviceMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchBookMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFundMapper;
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
 * AS-IS BatchMain.icamBook (L2569) — 기준일(기본: 직전 영업일)의 ICAM 펀드별 운용종목 원장(uzm0ui)을 읽는다.
 * ① 운용(ICAM): 회사별로 그 날 fnd10_book을 지우고, 각 행의 펀드·종목을 asseterpdb에서 찾아 fnd10_book에 넣는다.
 * ② 자문/일임(ICAM2): 회사별로 그 날 adv10_book을 지우고 넣는다.
 * 한 트랜잭션: 하나라도 실패하면 모두 되돌리고 `단계 문구 / 원인`(AS-IS)으로 알린다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamBookAction implements BatchAction {

    private static final String Q_FND = "fnd10_book.selectIcamBook";
    private static final String Q_ADV = "adv10_book.selectIcamBook";

    private final BatchCommonMapper commonMapper;
    private final BatchIcamMapper icamMapper;
    private final BatchAdviceMapper adviceMapper;
    private final BatchBookMapper bookMapper;
    private final BatchFundMapper fundMapper;
    private final IcamReader icamReader;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "icamBook";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 운용종목 원장 가져오기 시작 (icamBook) companyId={}, worker={}", req.companyId(), req.worker());

        LocalDate stdDate;
        if (req.stdDate() == null || req.stdDate().isEmpty()) {
            stdDate = commonMapper.selectBizDate(0L, LocalDate.now(), "-1");
        } else {
            try {
                stdDate = LocalDate.parse(req.stdDate());
            } catch (DateTimeParseException e) {
                // AS-IS는 파싱 실패를 삼키고 null로 진행한다(원본-이상한점 #214)
                throw new BusinessException(ErrorCode.INVALID_INPUT, "stdDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.stdDate(), e);
            }
        }
        String companyId = "ALL".equals(req.companyId()) ? "%" : req.companyId();
        String std = stdDate == null ? null : stdDate.toString();

        String errMsg = "1 운용 펀드원장Get 실패.." + companyId;
        try {
            // ---- 운용 펀드원장 ----
            for (BatchIcamCompany company : icamMapper.selectIcamCompanies(companyId)) {
                Long cid = company.companyId();
                errMsg = "3 (운용)ICAM 회사코드 : " + company.icamCompanyCode();

                Map<String, Object> param = new HashMap<>();
                param.put("icamCompanyCode", company.icamCompanyCode());
                param.put("companyId", cid);
                param.put("stdDate", std);

                errMsg = "4 처리전 기준일 원장 delete 실패 - param : " + param;
                bookMapper.deleteFndBook(cid, stdDate);

                errMsg = "5 ICAM Data GET! 실패 - param : " + param;
                List<IcamRow> rows = icamReader.read(IcamServer.ICAM, Q_FND, param);
                if (rows.isEmpty()) {
                    noticeLog.notice(actionCode(), "icamBookList(fnd10) size : 0 ", param.toString());
                }

                for (IcamRow r : rows) {
                    String fundCode = r.getString("fnd10_fund_cd");
                    String itemCode = r.getString("fnd10_item_cd");

                    errMsg = "7 fnd10 insertModel SET 실패... fundCode : " + fundCode;
                    Long fundCodeId = bookMapper.selectFundCodeId(cid, fundCode);
                    if (fundCodeId == null) {   // AS-IS: fundModel이 null → NullPointerException (#214)
                        throw new NullPointerException("fnd01 펀드 없음: companyId=" + cid + ", fundCode=" + fundCode);
                    }
                    errMsg = "8 fnd10 insertModel SET 실패... AstClassTreeId get param : " + param + ", fundCode=" + fundCode + ", itemCode=" + itemCode;
                    Long astId = bookMapper.selectItemClassTreeId(cid, itemCode);
                    if (astId == null) {        // AS-IS: itemModel이 null → NullPointerException (#214)
                        throw new NullPointerException("ast01 종목 없음: companyId=" + cid + ", itemCode=" + itemCode);
                    }

                    errMsg = "10 fnd10 insert 실패";
                    bookMapper.insertFndBook(new BatchFndBook(fundMapper.selectSeq(), r.getDate("fnd10_std_date"), fundCodeId, astId, cid,
                            r.getDecimal("fnd10_pur_amt"), r.getDecimal("fnd10_eval_amt"), r.getDecimal("fnd10_eval_pl_amt"),
                            r.getDecimal("fnd10_recv_amt"), r.getString("fnd10_note"), req.worker(), r.getString("fnd10_detail_type"),
                            itemCode, r.getString("fnd10_item_group_cd"), r.getString("fnd10_item_group_nm"),
                            r.getString("fnd10_market_cd"), r.getString("fnd10_market_nm")));
                }
            }

            // ---- 자문/일임 펀드원장 ----
            errMsg = "11 자문/일임 펀드원장Get 실패.." + companyId;
            for (BatchIcamCompany company : adviceMapper.selectAdvisCompanies(companyId)) {
                Long cid = company.companyId();
                errMsg = "12 (자문/일임)ICAM 회사코드.." + company.icamCompanyCode();

                Map<String, Object> param = new HashMap<>();
                param.put("icamAdvisCompanyCode", company.icamCompanyCode());
                param.put("companyId", cid);
                param.put("stdDate", std);

                errMsg = "13 (자문/일임)처리전 기준일 원장 delete 실패 - param : " + param;
                bookMapper.deleteAdvBook(cid, stdDate);

                errMsg = "14 (자문/일임)ICAM Data GET! 실패 - param : " + param;
                List<IcamRow> rows = icamReader.read(IcamServer.ICAM2, Q_ADV, param);
                if (rows.isEmpty()) {
                    noticeLog.notice(actionCode(), "icamAdvisBookList(adv10) size : 0 ", param.toString());
                }

                for (IcamRow r : rows) {
                    errMsg = "16 (자문/일임) adv1 insertModel SET 실패 - manageCode : " + r.getString("adv10_manage_cd");
                    // AS-IS: 평가금액 별칭이 fnd10_eval_amt라 adv10_eval_amt에 안 담겨 항상 null (#214)
                    errMsg = "17 (자문/일임) adv1 insert 실패";
                    bookMapper.insertAdvBook(new BatchAdvBook(fundMapper.selectSeq(), r.getDate("adv10_std_date"), cid,
                            r.getString("adv10_manage_cd"), r.getString("adv10_manage_nm"), r.getString("adv10_item_cd"),
                            r.getString("adv10_item_nm"), r.getDecimal("adv10_qty"), r.getDecimal("adv10_eval_amt"),
                            r.getString("adv10_item_group_cd"), r.getString("adv10_item_group_nm"),
                            r.getString("adv10_market_cd"), r.getString("adv10_market_nm"), req.worker()));
                }
            }
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, errMsg + " / " + e, e);
        }
        return "BOOK 작업완료..commit";
    }
}
