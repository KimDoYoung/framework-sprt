package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 교육사항 일괄등록 (AS-IS multiUpdate: educationModel + 사원찾기에서 고른 사람 목록) */
public record EducationCopyReq(
        Long educationId,
        List<Long> personIds
) {}
