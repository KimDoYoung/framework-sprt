package kr.co.kfs.asseterp.biz.flt.dto;

/**
 * 사전신고 화면 위 안내(AS-IS Flt02_Emp.selectByDate + Flt04_Oath.selectByDate) + 서버 오늘 + 회사의 사전신고 소급 설정.
 * hasEmp=false면 보고주기 설정이 없다(flt02_emp 행 없음).
 */
public record TrCheckRes(
        Boolean hasEmp,
        String checkCycle,
        Long yearInvestLimit,
        String investAmtCalcTargetCode,
        Boolean investAmtOverCheckYn,
        String oathStatusCode,
        String today,
        Boolean fltOnlyCurrYn) {
}
