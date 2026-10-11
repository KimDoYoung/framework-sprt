package kr.co.kfs.asseterp.biz.emp.dto;

/** 프로젝트 저장 요청 */
public record ProjectSaveReq(
        Long projectId,
        Long personId,
        String frYm,
        String toYm,
        String projectNm,
        String note
) {}
