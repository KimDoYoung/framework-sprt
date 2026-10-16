package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceRes;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceSearchParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysAfterServiceMapper {

    /** AS-IS sys90_after_service.selectByAdmin */
    List<AfterServiceRes> selectByAdmin(@Param("p") AfterServiceSearchParam param);

    /** AS-IS sys90_after_service.selectByIncomplete (완료·취소 상태 제외) */
    List<AfterServiceRes> selectByIncomplete(@Param("p") AfterServiceSearchParam param);

    /** AS-IS sys90_after_service.selectById */
    AfterServiceRes selectById(@Param("afterServiceId") Long afterServiceId);

    /** AS-IS sys90_after_service.adminUpdate */
    int adminUpdate(@Param("r") AfterServiceAdminSaveReq req);

    /** AS-IS sys90_after_service.updateRemarks */
    int updateRemarks(@Param("afterServiceId") Long afterServiceId, @Param("remarks") String remarks);
}
