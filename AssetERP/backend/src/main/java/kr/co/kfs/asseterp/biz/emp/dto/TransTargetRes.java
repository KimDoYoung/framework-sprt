package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 발령 기준 사원 선택(Emp01_Lookup_TransDate) 행 — 그리드는 조직·사번·성명·직책, 확인 때 transCd·personId·hireDate·transDate를 쓴다 */
public record TransTargetRes(
        Long personId,
        String transCd,
        LocalDate hireDate,
        LocalDate transDate,
        String orgNm,
        String empNo,
        String korNm,
        String titleNm
) {
}
