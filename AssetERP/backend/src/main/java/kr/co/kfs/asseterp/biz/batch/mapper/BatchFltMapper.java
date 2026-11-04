package kr.co.kfs.asseterp.biz.batch.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** 자기매매 배치 SQL (AS-IS: flt11_book.deleteByCompanyId, flt11_book.selectInsert) */
@Mapper
public interface BatchFltMapper {

    /** 오늘 이후(>= f_today()) 보유원장 정리 */
    int deleteFlt11FromToday(@Param("companyId") Long companyId);

    /** 직전 영업일 보유원장 중 수량이 남은 것을 오늘 날짜로 이월 */
    int insertFlt11Carry(@Param("companyId") Long companyId);
}
