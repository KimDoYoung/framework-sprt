package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/** 공통코드 저장 행. codeId가 없거나 0 이하면 신규. companyId는 코드가 속한 회사(시스템 코드 0) */
public record CodeSaveReq(
        Long codeId,
        Long companyId,
        Long codeKindId,
        String code,
        String name,
        String seq,
        boolean closeYn,
        LocalDate applyDate,
        LocalDate closeDate,
        String note
) {
    public boolean isNew() {
        return codeId == null || codeId <= 0;
    }
}
