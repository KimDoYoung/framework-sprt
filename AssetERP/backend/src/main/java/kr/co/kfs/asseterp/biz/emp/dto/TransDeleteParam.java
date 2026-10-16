package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 발령 삭제 (로그인 회사 사람의 발령만) */
public record TransDeleteParam(
        Long companyId,
        List<Long> transIds
) {
}
