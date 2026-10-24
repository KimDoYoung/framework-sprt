package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.TaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmTaskMapper {

    /** AS-IS tdm10_task.selectByText */
    List<TaskRes> selectByText(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate,
                               @Param("taskClassCode") String taskClassCode, @Param("allYn") boolean allYn,
                               @Param("searchText") String searchText);

    /** AS-IS tdm10_task.selectById */
    TaskRes selectById(@Param("companyId") Long companyId, @Param("taskId") Long taskId);

    /** AS-IS tdm10_task.countUseByTaskId */
    int countUseByTaskId(@Param("taskId") Long taskId);

    Long selectNextId();

    /** AS-IS tdm10_task.createCopy (결과 'Y' 또는 오류 문구) */
    String createCopy(@Param("oldTaskId") Long oldTaskId, @Param("newTaskId") Long newTaskId);

    int insertTask(@Param("taskId") Long taskId, @Param("companyId") Long companyId,
                   @Param("req") TaskSaveReq req, @Param("updName") String updName);

    int updateTask(@Param("companyId") Long companyId, @Param("req") TaskSaveReq req, @Param("updName") String updName);

    int deleteTasks(@Param("taskIds") List<Long> taskIds, @Param("companyId") Long companyId);
}
