package kr.co.kfs.asseterp.biz.emp.dto;

/** 학력정보 저장 요청 */
public record AcademicSaveReq(
        Long academicId,
        Long personId,
        String frYm,
        String toYm,
        String schoolName,
        String bachelorDegree,
        String financeRelateYn,
        String degreeCredit,
        String graduateDegree,
        String schoolLocation,
        String note
) {}
