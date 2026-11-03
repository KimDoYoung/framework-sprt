package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** AS-IS Org01_Code.updateDcrAuth 요청 (dcrCodeId = 고른 문서분류 + 바뀐 조직 행) */
public record DcrOrgAuthByClassSaveReq(Long classTreeId, List<DcrOrgAuthByClassRow> rows) {
}
