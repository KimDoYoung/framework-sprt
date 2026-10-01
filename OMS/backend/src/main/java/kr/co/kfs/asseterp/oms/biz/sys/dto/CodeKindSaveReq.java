package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 코드종류 저장 행. codeKindId가 없거나 0 이하면 신규 */
public record CodeKindSaveReq(Long codeKindId, String kindCd, String kindNm, boolean sysYn, String note) {

    public boolean isNew() {
        return codeKindId == null || codeKindId <= 0;
    }
}
