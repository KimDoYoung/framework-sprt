package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 코드그룹 저장 행. codeGroupId가 없거나 0 이하면 신규 */
public record CodeGroupSaveReq(Long codeGroupId, String kindGroupCd, String kindGroupNm, Long codeKindId, Long codeId, String note) {

    public boolean isNew() {
        return codeGroupId == null || codeGroupId <= 0;
    }
}
