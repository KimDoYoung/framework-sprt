package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusDetailRes;
import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcamFundOperateStatusMapper {

    List<FundOperateStatusRes> selectFundBookAvg(
            @Param("companyId") Long companyId,
            @Param("startDate") LocalDate startDate,
            @Param("closeDate") LocalDate closeDate,
            @Param("fundType") String fundType,
            @Param("searchText") String searchText
    );

    List<FundOperateStatusDetailRes> selectByStdDate(
            @Param("companyId") Long companyId,
            @Param("stdDate") LocalDate stdDate,
            @Param("fundType") String fundType,
            @Param("searchText") String searchText
    );

    long selectNextId();

    int deletePrint(
            @Param("companyId") Long companyId,
            @Param("personId") Long personId,
            @Param("windowClassName") String windowClassName
    );

    int insertPrintFundOperateStatus(
            @Param("companyId") Long companyId,
            @Param("personId") Long personId,
            @Param("windowClassName") String windowClassName,
            @Param("groupId") Long groupId,
            @Param("startDate") LocalDate startDate,
            @Param("closeDate") LocalDate closeDate,
            @Param("fundType") String fundType,
            @Param("searchText") String searchText
    );
}
