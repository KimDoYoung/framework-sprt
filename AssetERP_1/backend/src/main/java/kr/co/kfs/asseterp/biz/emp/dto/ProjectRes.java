package kr.co.kfs.asseterp.biz.emp.dto;

/** 프로젝트 행 (AS-IS Emp13_ProjectModel) */
public record ProjectRes(
        Long projectId,
        Long personId,
        String frYm,
        String toYm,
        String projectNm,
        String note
) {}
