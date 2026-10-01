package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/** sys09_code INSERT/UPDATE 파라미터 (closeYn: 'true'/'false') */
public record CodeRow(Long codeId, Long companyId, Long codeKindId, String code, String name, String seq,
                      String closeYn, LocalDate applyDate, LocalDate closeDate, String note) {

    public static CodeRow of(Long id, Long companyId, CodeSaveReq req) {
        return new CodeRow(id, companyId, req.codeKindId(), req.code().trim(), req.name().trim(), req.seq(),
                String.valueOf(req.closeYn()), req.applyDate(), req.closeDate(), req.note());
    }
}
