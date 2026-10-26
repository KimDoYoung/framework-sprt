package kr.co.kfs.asseterp.biz.org.dto;

import java.util.List;

/** AS-IS Org01_Code.updateFundAuth 요청 (fundCodeId + 바뀐 트리 행) */
public record OrgFundAuthSaveReq(Long fundCodeId, List<OrgFundAuthRow> rows) {
}
