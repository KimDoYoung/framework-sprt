package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchFundCode;
import kr.co.kfs.asseterp.biz.batch.dto.BatchFundInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 펀드 기본(fnd01)·펀드 정보(fnd02) 반영용 SQL (AS-IS BatchMain.assetErpFundInsert가 쓰는 것) */
@Mapper
public interface BatchFundMapper {

    /** AS-IS dbConfig.getSeq */
    Long selectSeq();

    /** AS-IS fnd01_fund_code.selectByCompanyIdAndFundCode */
    List<BatchFundCode> selectFundCodes(@Param("companyId") Long companyId, @Param("fundCode") String fundCode);

    /** AS-IS fnd02_fund_info.selectOneByWorkDate — 기준일 이전 가장 최근 1건, 없으면 null */
    BatchFundInfo selectFundInfoByWorkDate(@Param("fundCodeId") Long fundCodeId, @Param("workDate") LocalDate workDate);

    /** AS-IS fnd01_fund_code.insertUpdate (PostgreSQL 쪽) */
    int upsertFundCode(@Param("p") BatchFundCode fundCode);

    /** AS-IS fnd02_fund_info.deleteByWorkDateAndFundCodeId */
    int deleteFundInfo(@Param("p") BatchFundInfo fundInfo);

    /** AS-IS fnd02_fund_info.insert */
    int insertFundInfo(@Param("p") BatchFundInfo fundInfo);
}
