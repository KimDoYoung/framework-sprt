package kr.co.kfs.asseterp.biz.emp.dto;

/** 교육사항 행 (AS-IS Emp19_EducationModel) */
public record EducationRes(
        Long educationId,
        Long personId,
        String issueDate,
        String content,
        String educationYn,
        String note,
        String educationCorpNm
) {}
