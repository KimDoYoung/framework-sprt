package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.ErrandRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpErrandMapper {

    List<ErrandRes> selectByManager(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                    @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText);
}
