package kr.co.kfs.asseterp.biz.apr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprIdRowRes;

@Mapper
public interface AprApprIdListMapper {

    /** AS-IS apr01_appr.selectByApprIdList (회사 조건 추가) */
    List<AprApprIdRowRes> selectByApprIdList(@Param("companyId") Long companyId, @Param("apprIdList") List<Long> apprIdList);
}
