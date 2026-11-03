package kr.co.kfs.asseterp.biz.dcr.dto;

/** AS-IS dcr04_emp_auth.getTargetClassTreeList 한 행 (사원 한 명의 예외 문서분류) */
public record DcrEmpAuthClassRes(Long empAuthId, Long classTreeId, String classTreeFullName) {
}
