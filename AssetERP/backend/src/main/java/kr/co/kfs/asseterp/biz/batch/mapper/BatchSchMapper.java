package kr.co.kfs.asseterp.biz.batch.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** 스케줄 배치 SQL (AS-IS: sch04_list.selectInsert, sch03_deadline.createSch09) */
@Mapper
public interface BatchSchMapper {

    /** 당일 미처리 스케줄(sch04_list) 생성 — 회사 한 곳의 기준일 건 */
    int insertSch04List(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /**
     * 반복일정(sch09) 생성. AS-IS는 selectOne이라 대상 행이 2개 이상이면 MyBatis가 예외를 던진다(그대로 옮김).
     * 결과가 "Y"면 AS-IS는 오류 로그만 남긴다.
     */
    String createSch09(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);
}
