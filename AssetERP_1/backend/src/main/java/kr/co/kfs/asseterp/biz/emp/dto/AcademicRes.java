package kr.co.kfs.asseterp.biz.emp.dto;

/** 학력정보 행 (AS-IS Emp05_AcademicModel) */
public record AcademicRes(
        Long academicId,
        Long personId,
        String frYm,
        String toYm,
        String schoolName,
        String bachelorDegree,
        String bachelorDegreeNm,
        String financeRelateYn,
        String degreeCredit,
        String graduateDegree,
        String graduateDegreeNm,
        String schoolLocation,
        String note
) {}
