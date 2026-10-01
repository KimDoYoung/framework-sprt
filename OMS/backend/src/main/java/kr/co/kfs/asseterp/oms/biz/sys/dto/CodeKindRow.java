package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys08_code_kind INSERT/UPDATE 파라미터 (sysYn: 'true'/'false') */
public record CodeKindRow(Long codeKindId, String kindCd, String kindNm, String sysYn, String note) {

    public static CodeKindRow of(Long id, CodeKindSaveReq req) {
        return new CodeKindRow(id, req.kindCd().trim(), req.kindNm().trim(), String.valueOf(req.sysYn()), req.note());
    }
}
