package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.AstCfBatchCreateReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfInfoRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfInfoSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstCfInfoMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstCfInfoService {

    private final AstCfInfoMapper mapper;

    public List<AstCfInfoRes> getCfInfoList(Long astClassTreeId) {
        return mapper.selectCfInfoList(astClassTreeId);
    }

    public List<AstCfRes> getCfList(Long cfInfoId) {
        return mapper.selectCfList(cfInfoId);
    }

    @Transactional
    public List<AstCfInfoRes> saveCfInfoList(List<AstCfInfoSaveReq> rows) {
        if (rows == null || rows.isEmpty()) return List.of();
        for (AstCfInfoSaveReq req : rows) {
            if (req.cfInfoId() != null && req.cfInfoId() > 0) {
                mapper.updateCfInfo(req);
            } else {
                long newId = mapper.selectNextSeq();
                mapper.insertCfInfo(newId, req);
            }
        }
        Long astClassTreeId = rows.get(0).astClassTreeId();
        return astClassTreeId != null ? mapper.selectCfInfoList(astClassTreeId) : List.of();
    }

    @Transactional
    public int deleteCfInfo(Long cfInfoId) {
        if (cfInfoId == null) return 0;
        mapper.deleteCfByCfInfoId(cfInfoId);
        return mapper.deleteCfInfo(cfInfoId);
    }

    @Transactional
    public List<AstCfRes> saveCfList(List<AstCfSaveReq> rows) {
        if (rows == null || rows.isEmpty()) return List.of();
        for (AstCfSaveReq req : rows) {
            if (req.cfId() != null && req.cfId() > 0) {
                mapper.updateCf(req);
            } else {
                long newId = mapper.selectNextSeq();
                mapper.insertCf(newId, req);
            }
        }
        Long cfInfoId = rows.get(0).cfInfoId();
        return cfInfoId != null ? mapper.selectCfList(cfInfoId) : List.of();
    }

    @Transactional
    public int deleteCf(Long cfId) {
        if (cfId == null) return 0;
        return mapper.deleteCf(cfId);
    }

    /**
     * AS-IS ast.Ast03_CfInfo.bacthUpdate 이식
     */
    @Transactional
    public List<AstCfRes> batchCreate(UserPrincipal user, AstCfBatchCreateReq req) {
        mapper.deleteCfByCfInfoId(req.cfInfoId());

        String dateCode = req.dateCode() != null ? req.dateCode() : "31";
        String holidaySettleCode = req.holidaySettleCode() != null ? req.holidaySettleCode() : "0";
        String startYm = req.startYm();
        String closeYm = req.closeYm();
        Long amt = req.amt() != null ? req.amt() : 0L;
        Long contAmt = req.contAmt() != null ? req.contAmt() : 0L;
        Long tax = req.tax() != null ? req.tax() : 0L;
        Long cycle = req.cycle() != null ? req.cycle() : 1L;
        Long round = req.round() != null ? req.round() : 1L;
        Long companyId = user.getCompanyId();

        DateFormat ymFormat = new SimpleDateFormat("yyyy-MM");
        DateFormat startFormat = new SimpleDateFormat("yyyy-MM-dd");
        DateFormat closeFormat = new SimpleDateFormat("yyyy-MM-dd");

        try {
            int seq = round.intValue();
            int check = 0;

            Calendar startCal = Calendar.getInstance();
            startCal.setTime(startFormat.parse(startYm + "-01"));

            Calendar closeCal = Calendar.getInstance();
            closeCal.setTime(closeFormat.parse(closeYm + "-01"));

            String holidayStr;
            if ("1".equals(holidaySettleCode)) {
                holidayStr = "-0";
            } else if ("2".equals(holidaySettleCode)) {
                holidayStr = "+0";
            } else {
                holidayStr = "0";
            }

            while (check >= 0) {
                Date targetDate;
                String ymStr = ymFormat.format(startCal.getTime());
                String month = ymStr.substring(5, 7);

                if ("31".equals(dateCode)) {
                    targetDate = mapper.selectLastDate(startCal.getTime());
                } else if ("02".equals(month) && ("29".equals(dateCode) || "30".equals(dateCode))) {
                    targetDate = mapper.selectLastDate(startFormat.parse(ymStr + "-01"));
                } else {
                    targetDate = startFormat.parse(ymStr + "-" + dateCode);
                }

                Date settleDate = mapper.selectBizDate(companyId, holidayStr, targetDate);

                LocalDate localDate = targetDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate localSettleDate = settleDate != null ? settleDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : localDate;

                long cfId = mapper.selectNextSeq();
                AstCfSaveReq saveReq = new AstCfSaveReq(
                        cfId,
                        req.cfInfoId(),
                        (long) seq,
                        localDate,
                        localSettleDate,
                        amt,
                        null,
                        contAmt,
                        tax
                );
                mapper.insertCf(cfId, saveReq);

                seq++;
                startCal.add(Calendar.MONTH, cycle.intValue());
                check = closeCal.compareTo(startCal);
            }

            mapper.updateBatchInfo(req);

        } catch (ParseException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "날짜 형식이 올바르지 않습니다: " + e.getMessage());
        }

        return mapper.selectCfList(req.cfInfoId());
    }
}
