package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamIpo;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIcamIpoMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
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
 * AS-IS BatchMain.icamIpo (L2969) — 기준일(기본: 25영업일 전) 이후 청약이 시작되는 ICAM 공모주
 * (sjg1jc·sjg1fc)를 icam25_ipo에 넣는다. 그 날짜 이후 청약시작분을 먼저 모두 지운다.
 * 한 트랜잭션, 실패 시 원인 문구만(AS-IS). 회사와 무관.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamIpoAction implements BatchAction {

    private static final String Q_IPO = "icam25_ipo.selectIcamIpo";

    private final BatchCommonMapper commonMapper;
    private final BatchIcamIpoMapper ipoMapper;
    private final IcamReader icamReader;

    @Override
    public String actionCode() {
        return "icamIpo";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 공모주 청약정보 가져오기 시작 (icamIpo) worker={}", req.worker());

        LocalDate stdDate;
        if (req.stdDate() == null || req.stdDate().isEmpty()) {
            stdDate = commonMapper.selectBizDate(0L, LocalDate.now(), "-25");
        } else {
            try {
                stdDate = LocalDate.parse(req.stdDate());
            } catch (DateTimeParseException e) {
                // AS-IS는 파싱 실패를 삼키고 null로 format하다 NPE로 서블릿이 죽는다(원본-이상한점 #218)
                throw new BusinessException(ErrorCode.INVALID_INPUT, "stdDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.stdDate(), e);
            }
        }
        if (stdDate == null) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "기준일(25영업일 전)을 구할 수 없습니다.");
        }

        try {
            Map<String, Object> param = new HashMap<>();
            param.put("stdDate", stdDate.toString());
            param.put("stdDateStr", stdDate.toString());

            ipoMapper.deleteFrom(stdDate);

            List<IcamRow> rows = icamReader.read(IcamServer.ICAM, Q_IPO, param);
            for (IcamRow r : rows) {
                ipoMapper.insert(new BatchIcamIpo(r.getString("icam25_item_nm"), r.getString("icam25_iss_corp_cd"),
                        r.getDate("icam25_start_date"), r.getDate("icam25_close_date"), r.getLong("icam25_company_count"),
                        r.getLong("icam25_total_company_count"), r.getDecimal("icam25_reg_rate"), req.worker()));
            }
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage(), e);
        }
        return "ipo 작업완료..commit";
    }
}
