package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** AS-IS Org01_Code.copyDcrRight 요청 (출발 조직의 문서권한을 도착 조직들에 복사) */
public record DcrOrgAuthCopyReq(Long startOrgCodeId, List<Long> closeOrgCodeIds) {
}
