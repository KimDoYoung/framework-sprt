package kr.co.kfs.asseterp.biz.frm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.frm.dto.FrmIcsNoticeRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmInitialScreenRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmMonitorEmpRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmNoticeCntRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmToDoRes;
import kr.co.kfs.asseterp.biz.frm.mapper.FrmListMapper;
import kr.co.kfs.asseterp.common.config.properties.TenantProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/frm/Frm01_List.java (getNoticeCnt L59-68, selectIcsNotice L46-57, selectToDoList L33-44) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FrmListService {

    private final FrmListMapper mapper;
    private final EmpTransInfoService transInfoService;
    private final TenantProperties tenantProperties;

    /**
     * AS-IS MainFrame 생성자 L237-252 첫 탭: 회사 코드가 admin이면 관리자(adminYn)는 "고객별 시스템정보 관리"(COMPANY),
     * 아니면 "초기화면" 환영(WELCOME). admin 회사가 아니면 My Page(MYPAGE).
     */
    public FrmInitialScreenRes getInitialScreen(UserPrincipal user) {
        if (!tenantProperties.adminCode().equals(user.getCompanyCode())) {
            return new FrmInitialScreenRes("MYPAGE");
        }
        boolean adminYn = user.getUserId() < 0 && "true".equals(mapper.selectManagerAdminYn(-user.getUserId()));
        return new FrmInitialScreenRes(adminYn ? "COMPANY" : "WELCOME");
    }

    /** AS-IS getNoticeCnt: 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    public FrmNoticeCntRes getNoticeCnt(UserPrincipal user) {
        Long orgId = user.getUserId() < 0 ? Long.valueOf(0L) : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectNoticeCnt(user.getCompanyId(), user.getUserId(), orgId);
    }

    /**
     * AS-IS selectIcsNotice: orgCd = LoginUser.getOrgCodeId()(회사관리자는 0), selectDate가 없으면 오늘
     * (orgCodeLevel도 넘기지만 SQL이 쓰지 않는다)
     */
    public List<FrmIcsNoticeRes> searchIcsNotice(UserPrincipal user, LocalDate selectDate) {
        Long orgId = user.getUserId() < 0 ? Long.valueOf(0L) : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectIcsNotice(user.getCompanyId(), user.getUserId(), orgId, selectDate != null ? selectDate : LocalDate.now());
    }

    /** AS-IS selectToDoList: selectIcsNotice와 같은 파라미터(orgCd = 현재 조직, 회사관리자는 0), selectDate가 없으면 오늘 */
    public List<FrmToDoRes> searchToDo(UserPrincipal user, LocalDate selectDate) {
        Long orgId = user.getUserId() < 0 ? Long.valueOf(0L) : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectToDoList(user.getCompanyId(), user.getUserId(), orgId, selectDate != null ? selectDate : LocalDate.now());
    }

    /** AS-IS Monitoring_Page_Emp.retrieve L184-203 → emp.Emp03_Trans.MonitoringByText: transDate = 오늘, 검색어는 "%"+값+"%"(없으면 "%") */
    public List<FrmMonitorEmpRes> searchMonitorEmp(UserPrincipal user, String searchText) {
        String like = searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%";
        return mapper.selectMonitoringByText(user.getCompanyId(), LocalDate.now(), like);
    }
}
