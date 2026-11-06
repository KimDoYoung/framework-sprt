package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchHoldStdDate;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchExtrMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * AS-IS BatchMain.extrFundHoldItem (L2176) — 타사무수탁사가 보낸 운용펀드 보유종목(ifi34_stk)을
 * 임직원매매체크용 펀드보유주식(flt09_fund_item)으로 옮긴다. ICAM을 읽지 않는다(asseterpdb만).
 * 송신일(sendDate, yyyy-MM-dd)이 없으면 오늘. 먼저 수신분의 (회사, 기준일)별 기존 flt09를 지우고 다시 넣는다. 한 트랜잭션.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ExtrFundHoldItemAction implements BatchAction {

    private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyyMMdd");
    /** (2010:주식 / 2050:집합투자증권) — AS-IS는 2010 고정 */
    private static final String ITEM_TYPE = "2010";

    private final BatchExtrMapper extrMapper;

    @Override
    public String actionCode() {
        return "extrFundHoldItem";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("타사무 운용펀드 보유종목 가져오기 시작 (extrFundHoldItem) companyId={}, ifCode={}, sendDate={}", req.companyId(), req.ifCode(), req.sendDate());

        Long companyId = "ALL".equals(req.companyId()) ? null : Long.parseLong(req.companyId());
        String ifCode = "ALL".equals(req.ifCode()) ? null : req.ifCode();

        LocalDate sendDate;
        if (req.sendDate() == null || req.sendDate().isEmpty()) {
            sendDate = LocalDate.now();   // AS-IS: 전영업일 계산은 주석 처리, 오늘
        } else {
            try {
                sendDate = LocalDate.parse(req.sendDate());
            } catch (DateTimeParseException e) {
                // AS-IS는 파싱 실패를 삼키고 null로 NPE가 난다(원본-이상한점 #211)
                throw new BusinessException(ErrorCode.INVALID_INPUT, "sendDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.sendDate(), e);
            }
        }
        String send = sendDate.format(YMD);

        try {
            // 처리 전 기준일 정리(flt09 delete)
            for (BatchHoldStdDate d : extrMapper.selectHoldStdDates(companyId, ifCode, send)) {
                extrMapper.deleteFundItems(d.companyId(), LocalDate.parse(d.stdDate(), YMD));
            }
            // flt09 insert
            extrMapper.insertFundItems(companyId, ifCode, send, ITEM_TYPE);
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage(), e);
        }
        return "extrFundHoldItem 작업완료..commit";
    }
}
