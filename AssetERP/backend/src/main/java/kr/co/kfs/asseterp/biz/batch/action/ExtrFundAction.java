package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchExtrFund;
import kr.co.kfs.asseterp.biz.batch.dto.BatchExtrOfficeWork;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFund;
import kr.co.kfs.asseterp.biz.batch.dto.BatchOfficeWork;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchExtrMapper;
import kr.co.kfs.asseterp.biz.batch.service.AssetErpFundSync;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * AS-IS BatchMain.extrFund (L1282) — 타사무수탁사가 SFTP로 보낸 펀드정보(ifi30_fund)를 오늘 송신분만 읽어
 * 수탁사(fnd03)·사무수탁사(fnd06) 코드를 만들고 Asset-ERP 펀드(fnd01·fnd02)에 반영한다. ICAM은 읽지 않는다(asseterpdb만).
 * companyId=ALL·ifCode=ALL이면 조건 없음. 한 트랜잭션: 실패하면 모두 되돌리고 원인 문구만 알린다(AS-IS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ExtrFundAction implements BatchAction {

    private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final BatchExtrMapper extrMapper;
    private final AssetErpFundSync fundSync;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "extrFund";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("타사무 펀드정보 가져오기 시작 (extrFund) companyId={}, ifCode={}, worker={}", req.companyId(), req.ifCode(), req.worker());

        Long companyId = "ALL".equals(req.companyId()) ? null : Long.parseLong(req.companyId());
        String ifCode = "ALL".equals(req.ifCode()) ? null : req.ifCode();
        // AS-IS: 전영업일~전일 계산은 주석 처리되어 오늘 송신분만 본다
        String today = LocalDate.now().format(YMD);

        try {
            // 수탁사 정보생성
            extrMapper.insertConsignments(companyId, ifCode, today, today);

            // 사무수탁사 정보생성
            for (BatchExtrOfficeWork ow : extrMapper.selectOfficeWorks(companyId, ifCode, today, today)) {
                List<BatchOfficeWork> found = extrMapper.selectOfficeWorkByExtrCode(0L, ow.officeWorkCode(), ow.ifCode());
                if (found.isEmpty()) {
                    noticeLog.notice(actionCode(), "사무수탁사 맵핑코드 없음 : ifCode(" + ow.ifCode() + ") / officeWorkCode(" + ow.officeWorkCode() + ")", null);
                } else if (found.size() > 1) {
                    noticeLog.notice(actionCode(), "사무수탁사 맵핑코드 " + found.size() + "개 존재함 : ifCode(" + ow.ifCode() + ") / officeWorkCode(" + ow.officeWorkCode() + ")", null);
                }
                // AS-IS: 없어도 get(0)을 해서 IndexOutOfBounds로 전체가 롤백된다(원본-이상한점 #209)
                BatchOfficeWork mapped = found.get(0);

                if (extrMapper.countOfficeWorkByCode(ow.companyId(), mapped.officeWorkCode()) == 0) {
                    extrMapper.insertOfficeWork(ow.companyId(), ow.ifCode(), ow.officeWorkCode(), mapped);
                } else {
                    noticeLog.notice(actionCode(), "맵핑이 되어 있지 않은 사무수탁사코드가 존재합니다 (" + mapped.officeWorkName()
                            + "-자체코드:" + mapped.officeWorkCode() + "/외부코드:" + ow.officeWorkCode() + ")", null);
                }
            }

            // 펀드정보 생성
            for (BatchExtrFund f : extrMapper.selectFunds(companyId, ifCode, today, today)) {
                fundSync.sync(f.companyId(), toIcamFund(f, req.worker(), noticeLog, extrMapper), false);
            }
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "extrFUND 작업완료..commit";
    }

    private BatchIcamFund toIcamFund(BatchExtrFund f, String worker, BatchNoticeLogService noticeLog, BatchExtrMapper extrMapper) {
        // 사무수탁사 자체코드 Get — 정확히 1개일 때만 채운다
        String officeWorkCode = null;
        List<BatchOfficeWork> ow = extrMapper.selectOfficeWorkByExtrCode(f.companyId(), f.officeWorkCode(), f.ifCode());
        String fundDesc = "펀드 (" + f.fundCode() + " - " + f.officeWorkCode() + " " + f.officeWorkName() + ")";
        if (ow.isEmpty()) {
            noticeLog.notice(actionCode(), "사무수탁사코드 가져오기 실패(count = 0). " + fundDesc, null);
        } else if (ow.size() > 1) {
            noticeLog.notice(actionCode(), "사무수탁사코드 가져오기 실패(count > 1). " + fundDesc, null);
        } else {
            officeWorkCode = ow.get(0).officeWorkCode();
        }

        return new BatchIcamFund(null, null, ymd(f.sendDate()), f.fundCode(), f.fundName(), f.fundName(),
                f.kofiaFundCode(), f.kofiaTrustCode(), f.kofiaFundTypeCode(), f.kofiaPublicCode(), f.kofiaParentCode(),
                f.kofiaClassTypeCode(), f.kofiaFundUnitCode(), f.kofiaCharClassCode(),
                ymd(f.firstSetDate()),
                "N".equals(f.endYn()) ? null : ymd(f.endDate()),
                ymd(f.matDueDate()),
                f.operator1(), f.operator2(), f.oprDept(),
                f.custCode(), f.custName(), null, null,
                officeWorkCode, f.officeWorkName(),
                f.curCode(), ymd(f.nextCloseDate()), ymd(f.nextFeeDate()),
                worker, f.ksdFundCode(), f.ksdItemCode(),
                f.amRate(), f.salesRate(), f.custRate(), f.officeWorkRate(),
                f.setAmt(), f.nav(), null);
    }

    /** yyyyMMdd → 날짜, 비었으면 null (AS-IS: null·"" 검사) */
    private static LocalDate ymd(String s) {
        return (s == null || s.isEmpty()) ? null : LocalDate.parse(s, YMD);
    }
}
