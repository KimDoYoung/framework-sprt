package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.icam.dto.IcamPriceStockRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamPriceMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 공용 시세 종목 찾기 (AS-IS server/icam/Icam20_Price.java selectByStdDatePaging) — EE99 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class IcamPriceService {

    /** 화면이 보내는 종목구분 — 2010 = 주식 (Flt10_Lookup_ItemStk L179) */
    private static final String STOCK = "2010";

    private final IcamPriceMapper mapper;

    public PageRes<IcamPriceStockRes> searchStocks(String stdDate, String searchText, int limit, int offset) {
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        return new PageRes<>(mapper.selectByStdDatePagingTotal(stdDate, STOCK, text), mapper.selectByStdDatePaging(stdDate, STOCK, text, limit, offset));
    }

    public String stdDate(String date) {
        return mapper.selectStdDate(date);
    }
}
