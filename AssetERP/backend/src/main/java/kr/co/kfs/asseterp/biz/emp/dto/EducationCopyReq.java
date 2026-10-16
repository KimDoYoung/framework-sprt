package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/**
 * 교육사항 일괄등록 (AS-IS multiUpdate: 클라이언트 educationModel 값 + 사원찾기에서 고른 사람 목록).
 * 원본은 그리드 행 모델을 그대로 보낸다 — 저장 안 한(아무것도 안 고친) 새 행이면 빈 값이 복사된다.
 */
public record EducationCopyReq(
        String issueDate,
        String content,
        String educationYn,
        String note,
        String educationCorpNm,
        List<Long> personIds
) {}
