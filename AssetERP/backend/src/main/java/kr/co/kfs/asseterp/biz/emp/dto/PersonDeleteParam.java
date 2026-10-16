package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS Emp01_Person.deleteTarget 파라미터: 지울 사람, 지운 사람(empId = 로그인 사용자) */
public record PersonDeleteParam(
        Long companyId,
        Long personId,
        Long empId
) {
}
