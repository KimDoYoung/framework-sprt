package kr.co.kfs.asseterp.biz.flt.dto;

/** 정기보고현황 한 행 (AS-IS Flt10_TrModel · flt10_tr.selectEmpAppr, J06 Flt10_Tab_EmpAppr) — 사원별 서약서·점검주기·상신상태 */
public record EmpApprRes(
        Long trId,
        Long personId,
        String orgName,
        String personName,
        String oathYnName,
        String checkCycle,
        String checkCycleName,
        String checkApprName) {
}
