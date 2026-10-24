package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmTaskDetailMapper {

    /** AS-IS tdm12_task_relate_detail.selectByTaskId */
    List<TaskDetailRes> selectByTaskId(@Param("companyId") Long companyId, @Param("taskId") Long taskId);

    TaskDetailRes selectById(@Param("detailId") Long detailId);

    /** AS-IS tdm12_task_relate_detail.countByTaskDetailId */
    int countByTaskDetailId(@Param("taskDetailId") Long taskDetailId);

    /** 책무의 회사 ID, 아직 저장 전인 책무면 null */
    Long selectTaskCompany(@Param("taskId") Long taskId);

    Long selectNextId();

    int insertDetail(@Param("detailId") Long detailId, @Param("row") TaskDetailRow row, @Param("updName") String updName);

    int updateDetail(@Param("row") TaskDetailRow row, @Param("updName") String updName);

    int deleteDetails(@Param("detailIds") List<Long> detailIds);
}
