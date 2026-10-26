package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoManagerRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoViewRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01OrgRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01OrgSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01PeriodRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01PeriodSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SchInfoMapper {

    /** AS-IS sch01_info.selectByCloseDate (O02 기간별 업무일정 조회) */
    List<Sch01PeriodRes> selectByCloseDate(Sch01PeriodSearchCond cond);

    /** AS-IS sch01_info.selectByOrg (O03 부서별 업무일정 조회) */
    List<Sch01OrgRes> selectByOrg(Sch01OrgSearchCond cond);

    /** AS-IS sch01_info.selectByDeadLineId (O02 업무일정 보기 창) */
    Sch01InfoViewRes selectByDeadlineId(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("deadlineId") Long deadlineId);

    /** AS-IS sch01_info.selectByText */
    List<Sch01InfoRes> selectByText(Sch01InfoSearchCond cond);

    /** AS-IS sch01_info.selectById */
    Sch01InfoRes selectById(@Param("infoId") Long infoId, @Param("companyId") Long companyId);

    /** AS-IS sch01_info.selectByManagerId */
    List<Sch01InfoManagerRes> selectByManagerId(@Param("companyId") Long companyId, @Param("managerId") Long managerId, @Param("classId") Long classId,
                                         @Param("searchText") String searchText);

    /** AS-IS sch04_list.checkSchInfo — 이미 발생한 스케줄 수 */
    int countSchList(@Param("infoId") Long infoId);

    /** AS-IS sys05_user_role.getAdminCheck — 관리자 역할을 가진 사용자면 1 이상 */
    int countAdminRole(@Param("companyId") Long companyId, @Param("userId") Long userId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    int insertInfo(@Param("infoId") Long infoId, @Param("companyId") Long companyId, @Param("managerId") Long managerId);

    int updateInfo(@Param("infoId") Long infoId, @Param("companyId") Long companyId, @Param("req") Sch01InfoSaveReq req);

    int deleteInfos(@Param("companyId") Long companyId, @Param("infoIds") List<Long> infoIds);

    /** AS-IS sch01_info.deleteByInfoId */
    int deleteByInfoId(@Param("infoId") Long infoId, @Param("companyId") Long companyId);

    /** AS-IS sch02_share.selectByInfoId */
    List<Sch02ShareRes> selectSharesByInfoId(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    Sch02ShareRes selectShareById(@Param("companyId") Long companyId, @Param("shareId") Long shareId);

    // ---- 담당자 변경 처리 (copySchedule) ----
    List<Sch01InfoManagerRes> selectByIdList(@Param("companyId") Long companyId, @Param("infoIds") List<Long> infoIds);

    int insertClassByClassId(@Param("classId") Long classId, @Param("newClassId") Long newClassId, @Param("managerId") Long managerId, @Param("note") String note);

    int insertInfoByInfoId(@Param("infoId") Long infoId, @Param("newInfoId") Long newInfoId, @Param("managerId") Long managerId, @Param("newClassId") Long newClassId);

    int insertShareByInfoId(@Param("infoId") Long infoId, @Param("newInfoId") Long newInfoId);

    int insertDeadlineByInfoId(@Param("infoId") Long infoId, @Param("newInfoId") Long newInfoId);

    int insertRelateIcsByInfoId(@Param("infoId") Long infoId, @Param("newInfoId") Long newInfoId);

    int insertAlarmByTargetId(@Param("targetCode") String targetCode, @Param("targetId") Long targetId, @Param("newTargetId") Long newTargetId);

    int insertRelateFile(@Param("relateFileId") Long relateFileId, @Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("parentTable") String parentTable);

    int updateUseYnFalseByInfoId(@Param("infoId") Long infoId);
}
