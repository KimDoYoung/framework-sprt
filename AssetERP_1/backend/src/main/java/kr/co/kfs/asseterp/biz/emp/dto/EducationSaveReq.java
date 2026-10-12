package kr.co.kfs.asseterp.biz.emp.dto;

/** 교육사항 저장 요청 (그리드 컬럼: 교육일자·교육내용·수료여부) */
public record EducationSaveReq(
        Long educationId,
        Long personId,
        String issueDate,
        String content,
        String educationYn
) {}
