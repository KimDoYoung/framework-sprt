package kr.co.kfs.asseterp.biz.dcr.dto;

/** AS-IS dcr04_emp_auth.getTargetList 한 행 (예외사원 권한이 있는 사원) */
public record DcrEmpAuthTargetRes(Long personId, String orgName, String personName, String posName, String kindName) {
}
