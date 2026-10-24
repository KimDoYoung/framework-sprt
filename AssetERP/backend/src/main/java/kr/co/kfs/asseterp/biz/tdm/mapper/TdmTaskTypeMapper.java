package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmTaskTypeMapper {

    /** AS-IS tdm14_task_type.selectByCompanyId */
    List<TaskTypeRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("taskClassCode") String taskClassCode,
                                        @Param("useYn") boolean useYn);

    TaskTypeRes selectById(@Param("companyId") Long companyId, @Param("taskTypeId") Long taskTypeId);

    int countDupByTaskTypeCode(@Param("companyId") Long companyId, @Param("taskTypeCode") String taskTypeCode,
                               @Param("taskTypeId") Long taskTypeId);

    int countUseByTaskTypeCode(@Param("companyId") Long companyId, @Param("taskTypeCode") String taskTypeCode);

    String selectTaskTypeCode(@Param("companyId") Long companyId, @Param("taskTypeId") Long taskTypeId);

    Long selectNextId();

    int insertTaskType(@Param("taskTypeId") Long taskTypeId, @Param("companyId") Long companyId,
                       @Param("row") TaskTypeRow row, @Param("updName") String updName);

    int updateTaskType(@Param("companyId") Long companyId, @Param("row") TaskTypeRow row, @Param("updName") String updName);

    int deleteTaskTypes(@Param("taskTypeIds") List<Long> taskTypeIds, @Param("companyId") Long companyId);
}
