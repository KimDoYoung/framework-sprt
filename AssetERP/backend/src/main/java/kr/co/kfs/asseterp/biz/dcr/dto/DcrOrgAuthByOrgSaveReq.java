package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** AS-IS Dcr03_OrgAuth.update 요청 (orgCodeId = 고른 조직 + 바뀐 문서분류 행) */
public record DcrOrgAuthByOrgSaveReq(Long orgCodeId, List<DcrOrgAuthByOrgRow> rows) {
}
