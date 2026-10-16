package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.ManualRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys95_manual.xml selectByText (publicCheck=true 고정 — Sys95_Tab_Manual) */
@Mapper
public interface SysManualMapper {
    /** AS-IS sys95_manual.selectByText (manualType·searchText는 LIKE 패턴) */
    List<ManualRes> selectByText(@Param("manualType") String manualType, @Param("searchText") String searchText);
}
