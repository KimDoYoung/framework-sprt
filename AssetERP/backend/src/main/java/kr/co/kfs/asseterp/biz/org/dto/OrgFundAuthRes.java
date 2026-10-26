package kr.co.kfs.asseterp.biz.org.dto;

/** 펀드별 조직 권한 트리 한 행 (AS-IS Org01_CodeModel 중 Fnd08_Page_OrgAuth 열 + fnd08_org_auth). 전위 순서 + depth */
public record OrgFundAuthRes(Long codeId, Long parentCodeId, Integer depth, String korName, String orgCode,
                             Long orgAuthId, String authYn, String note) {

    public OrgFundAuthRes withDepth(int depth) {
        return new OrgFundAuthRes(codeId, parentCodeId, depth, korName, orgCode, orgAuthId, authYn, note);
    }
}
