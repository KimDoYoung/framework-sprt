package kr.co.kfs.asseterp.biz.frm.dto;

/**
 * MyPage 현황판 한 사람 (AS-IS Emp03_TransModel — emp03_trans.MonitoringByText, Monitoring_Page_Emp.buildGrid L177-179:
 * 사진(personIdString) · 이름 직위(monitoringName) · 상태(locationCode 아이콘)). 셀을 누르면 Emp00_Popup_Emp(사번·부서·이메일·사무실·내선·현상태)
 */
public record FrmMonitorEmpRes(
        Long personId,
        String empNo,
        String emailAddress,
        String mobileTelNo,
        String officeTelNo,
        String officeDetail,
        String parentFullName,
        String personIdString,
        String monitoringName,
        String locationName,
        String locationCode
) {
}
