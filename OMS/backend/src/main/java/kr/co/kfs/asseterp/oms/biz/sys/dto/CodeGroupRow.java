package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys13_code_group INSERT/UPDATE 파라미터 */
public record CodeGroupRow(Long codeGroupId, String kindGroupCd, String kindGroupNm, Long codeKindId, Long codeId, String note) {

    public static CodeGroupRow of(Long id, CodeGroupSaveReq req) {
        return new CodeGroupRow(id, req.kindGroupCd(), req.kindGroupNm(), req.codeKindId(), req.codeId() == null ? 0L : req.codeId(), req.note());
    }
}
