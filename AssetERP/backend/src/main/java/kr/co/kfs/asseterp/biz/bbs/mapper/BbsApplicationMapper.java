package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs11_application.xml */
@Mapper
public interface BbsApplicationMapper {
    /** AS-IS selectByAppStatus (증명서 신청 10·11·12) */
    List<ApplicationRes> selectByAppStatus(@Param("companyId") Long companyId, @Param("appStatus") String appStatus);
}
