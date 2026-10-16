package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceRes;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceSearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceUserSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceUserSearchParam;
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

    /** AS-IS sys.Sys90_AfterService.selectBySearchText (A29) */
    List<AfterServiceRes> selectBySearchText(@Param("p") AfterServiceUserSearchParam param);

    /** AS-IS sys90_after_service.userUpdate — UPDATE 하고 없으면 INSERT (A29) */
    int userUpdate(@Param("companyId") Long companyId, @Param("r") AfterServiceUserSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel — sys90_after_service_id로 DELETE (A29) */
    int deleteById(@Param("afterServiceId") Long afterServiceId);

    /** AS-IS GridInsertRow의 getSeq (= f_create_seq) (A29) */
    Long selectNewId();
}
