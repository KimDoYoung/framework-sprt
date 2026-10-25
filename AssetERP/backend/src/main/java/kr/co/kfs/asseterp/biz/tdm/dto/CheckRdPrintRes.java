package kr.co.kfs.asseterp.biz.tdm.dto;

/** RD 뷰어용 출력 자료 (AS-IS Sys99_Print.CreateTdmCheckJob 결과 groupId + 보고서 매개값) */
public record CheckRdPrintRes(Long groupId, String yyyymm, String roleName, String exctName) {
}
