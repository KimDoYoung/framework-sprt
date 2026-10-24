package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmTaskDutyMapper {

    /** AS-IS tdm12_task_relate_detail.selectByText */
    List<TaskDutyDetailRes> selectDetailsByText(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate,
                                                @Param("taskTypeCode") String taskTypeCode, @Param("allYn") boolean allYn,
                                                @Param("searchText") String searchText);

    /** AS-IS tdm13_task_relate_duty.selectByTaskRelateDetailId */
    List<TaskDutyRes> selectByTaskRelateDetailId(@Param("companyId") Long companyId, @Param("taskRelateDetailId") Long taskRelateDetailId);

    TaskDutyRes selectById(@Param("dutyId") Long dutyId);

    /** AS-IS tdm13_task_relate_duty.countByDutyId */
    int countByDutyId(@Param("dutyId") Long dutyId);

    /** 세부내용이 속한 책무의 회사 ID (없으면 null) */
    Long selectDetailCompany(@Param("taskRelateDetailId") Long taskRelateDetailId);

    Long selectNextId();

    int insertDuty(@Param("dutyId") Long dutyId, @Param("row") TaskDutyRes row, @Param("updName") String updName);

    int updateDuty(@Param("row") TaskDutyRes row, @Param("updName") String updName);

    int deleteDuties(@Param("dutyIds") List<Long> dutyIds);
}
