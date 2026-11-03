package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류별 조직 맵핑 트리 한 행 (AS-IS Org01_CodeModel 중 Dcr03_TabPage_DcrAuth 열 + dcr03_org_auth). 전위 순서 + depth(0부터). 조회·작성은 'true'/'false' */
public record DcrOrgAuthOrgRes(Long codeId, Long parentCodeId, Integer depth, String korName, String orgCode,
                               String retrieveYn, String updateYn, String note) {

    public DcrOrgAuthOrgRes withDepth(int depth) {
        return new DcrOrgAuthOrgRes(codeId, parentCodeId, depth, korName, orgCode, retrieveYn, updateYn, note);
    }
}
