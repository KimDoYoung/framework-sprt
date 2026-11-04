package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamData;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIcamMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.icam.reader.IcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * AS-IS BatchMain.icamData (L1042, 원본 주석 "(사용안함)") — ICAM 연계정보(asseterp_tr)를 회사별로 읽어 icam02_data에 넣는다.
 * companyId=ALL이면 모든 회사('%'). worker=batch이면 기준일은 직전 영업일, 아니면 stdDate 그대로.
 * 한 트랜잭션: 하나라도 실패하면 모두 되돌리고 오류 메시지를 돌려준다(AS-IS rollback).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamDataAction implements BatchAction {

    private static final String QUERY = "icam02_data.selectIcamData";

    private final BatchCommonMapper commonMapper;
    private final BatchIcamMapper icamMapper;
    private final IcamReader icamReader;

    @Override
    public String actionCode() {
        return "icamData";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 연계정보 가져오기 시작 (icamData) companyId={}, worker={}", req.companyId(), req.worker());

        String companyId = "ALL".equals(req.companyId()) ? "%" : req.companyId();
        String stdDate = req.stdDate();
        if ("batch".equals(req.worker())) {
            LocalDate biz = commonMapper.selectBizDate(0L, LocalDate.now(), "-1");
            stdDate = biz == null ? null : biz.toString();
        }
        log.debug("기준일: {}", stdDate);

        for (BatchIcamCompany company : icamMapper.selectIcamCompanies(companyId)) {
            log.debug("ICAM 회사코드: {}", company.icamCompanyCode());

            Map<String, Object> param = new HashMap<>();
            param.put("icamCompanyCode", company.icamCompanyCode());
            param.put("stdDate", stdDate);

            for (IcamRow r : icamReader.read(IcamServer.ICAM, QUERY, param)) {
                icamMapper.insertIcamData(new BatchIcamData(
                        r.getString("icam02_icam_company_cd"),
                        r.getDate("icam02_icam_date"),
                        r.getString("icam02_fund_cd"),
                        r.getString("icam02_fund_nm"),
                        r.getString("icam02_item_cd"),
                        r.getString("icam02_item_nm"),
                        r.getLong("icam03_seq"),
                        r.getString("icam02_info_cd"),
                        r.getString("icam02_tr_cd"),
                        r.getString("icam02_asset_cd"),
                        r.getString("icam02_asset_nm"),
                        r.getDate("icam02_tgt_date"),
                        r.getDecimal("icam02_tgt_amt"),
                        r.getDate("icam02_tgt_std_date"),
                        r.getString("icam02_note"),
                        req.worker()));
            }
        }
        return "DATA 작업완료...commit";
    }
}
