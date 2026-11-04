package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchFileRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 파일 존재 점검 SQL (AS-IS: sys10_file.selectByYear) */
@Mapper
public interface BatchFileMapper {

    /** 등록 연도(yyyy)가 같은 파일 전부 — 지운 것도 포함(AS-IS와 같다) */
    List<BatchFileRow> selectByYear(@Param("year") String year);
}
