package kr.co.kfs.asseterp.biz.frm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateBookingRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateLeaveRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateMyScheduleRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateNoticeRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateOrgScheduleRes;
import kr.co.kfs.asseterp.biz.frm.mapper.FrmRelateMapper;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistoryRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * MyPage 일정 박스 (AS-IS frm/Monitoring_Page_Relate.retrieve01~05 L322-424).
 * AS-IS 파라미터: companyId·personId = 로그인, orgId = LoginUser.getOrgCodeId()(회사관리자는 0), stdDate = LoginUser.getSelectDate()(없으면 오늘)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FrmRelateService {

    private final FrmRelateMapper mapper;
    private final EmpTransInfoService transInfoService;

    private Long orgOf(UserPrincipal user) {
        return user.getUserId() < 0 ? Long.valueOf(0L) : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
    }

    private static LocalDate dateOr(LocalDate d) {
        return d != null ? d : LocalDate.now();
    }

    public List<FrmRelateMyScheduleRes> searchMySchedule(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectMyPageSchedule(user.getCompanyId(), user.getUserId(), orgOf(user), dateOr(stdDate));
    }

    /** retrieve01_1 L339-357: subOrgYn=false(소속 조직만), dailyYn=false, searchText="%" */
    public List<FrmRelateOrgScheduleRes> searchOrgSchedule(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectMyPageOrgSchedule(user.getCompanyId(), orgOf(user), dateOr(stdDate), false, "%");
    }

    public List<MktHistoryRes> searchHistory(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectByRegDate(user.getCompanyId(), user.getUserId(), orgOf(user), dateOr(stdDate));
    }

    public List<FrmRelateNoticeRes> searchNotice(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectPersonNotice(user.getCompanyId(), user.getUserId(), orgOf(user), dateOr(stdDate));
    }

    /** retrieve04 L393-409: shareCheck=true */
    public List<FrmRelateLeaveRes> searchLeave(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectLeaveByDate(user.getCompanyId(), user.getUserId(), orgOf(user), dateOr(stdDate));
    }

    public List<FrmRelateBookingRes> searchBooking(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectByBookingDate(user.getCompanyId(), dateOr(stdDate));
    }
}
