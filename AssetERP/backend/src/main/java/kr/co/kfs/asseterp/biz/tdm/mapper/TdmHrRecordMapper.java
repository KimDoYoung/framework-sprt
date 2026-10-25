package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ChangeListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRecordRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmHrRecordMapper {

    /** AS-IS tdm02_hr_record.selectByCompanyId */
    List<HrRecordRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                        @Param("closeDate") LocalDate closeDate, @Param("applyCode") String applyCode,
                                        @Param("searchText") String searchText, @Param("limit") Integer limit);

    /** AS-IS tdm02_hr_record.selectChangeList */
    List<ChangeListRes> selectChangeList(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** 인사정보 행의 회사 (없으면 null) */
    Long selectCompanyId(@Param("hrRecordId") Long hrRecordId);

    /** AS-IS tdm02_hr_record.updateApplyCode */
    int updateApplyCode(@Param("hrRecordId") Long hrRecordId, @Param("applyCode") String applyCode,
                        @Param("note") String note, @Param("updName") String updName);
}
