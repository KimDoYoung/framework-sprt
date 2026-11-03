package kr.co.kfs.asseterp.biz.dcr.dto;

/** AS-IS dcr04_emp_auth.selectByText 한 행 (조회권한 예외사원: 문서분류 × 사원) */
public record DcrEmpAuthRes(Long empAuthId, Long personId, Long classTreeId, String orgName, String personName,
                            String posName, String kindName, String note, String retrieveYn) {
}
