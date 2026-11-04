package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamIpo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** ICAM 공모주 청약정보(icam25_ipo) 반영용 SQL (ICAM 읽기는 IcamReader) */
@Mapper
public interface BatchIcamIpoMapper {

    /** AS-IS icam25_ipo.delete — 기준일 이후 청약시작분 */
    int deleteFrom(@Param("stdDate") LocalDate stdDate);

    /** AS-IS icam25_ipo.insert */
    int insert(@Param("p") BatchIcamIpo ipo);
}
