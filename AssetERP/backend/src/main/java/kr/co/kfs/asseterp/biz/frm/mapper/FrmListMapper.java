package kr.co.kfs.asseterp.biz.frm.mapper;

import kr.co.kfs.asseterp.biz.frm.dto.FrmCalendarRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmIcsNoticeRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmMonitorEmpRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmNoticeCntRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmToDoRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/frm/mapper/frm01_list.xml */
@Mapper
public interface FrmListMapper {

    /** AS-IS MainFrame 초기 탭: 회사관리자(sys02_user)의 sys02_admin_yn. 없으면 null */
    String selectManagerAdminYn(@Param("userId") Long userId);

    /** AS-IS frm01_list.getNoticeCnt — orgId는 로그인 사원의 현재 조직(회사관리자는 0) */
    FrmNoticeCntRes selectNoticeCnt(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("orgId") Long orgId);

    /** AS-IS frm01_list.selectIcsNotice — MyPage 법규보고공시 및 내규정보(선택일 마감) */
    List<FrmIcsNoticeRes> selectIcsNotice(@Param("companyId") Long companyId, @Param("empId") Long empId,
                                          @Param("orgCd") Long orgCd, @Param("selectDate") LocalDate selectDate);

    /** AS-IS frm01_list.selectToDoList — MyPage Day List(선택일) */
    List<FrmToDoRes> selectToDoList(@Param("companyId") Long companyId, @Param("empId") Long empId,
                                    @Param("orgCd") Long orgCd, @Param("selectDate") LocalDate selectDate);

    /** AS-IS frm01_list.selectCalendar — MyPage 달력(기간 안 날짜별 업무구분 건수). orgCd는 회사관리자면 0 */
    List<FrmCalendarRes> selectCalendar(@Param("companyId") Long companyId, @Param("userId") Long userId, @Param("orgCd") Long orgCd,
                                        @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS emp03_trans.MonitoringByText — MyPage 현황판(기준일 발령 기준 재직자, 이름·부서 검색) */
    List<FrmMonitorEmpRes> selectMonitoringByText(@Param("companyId") Long companyId, @Param("transDate") LocalDate transDate,
                                                  @Param("searchText") String searchText);
}
