package kr.co.kfs.asseterp.biz.org.dto;

import java.util.List;

/** AS-IS Org01_Code.updateAccountAuth 요청 (accountId + 바뀐 트리 행). 행 모양은 펀드 권한과 같아 OrgFundAuthRow를 쓴다 */
public record OrgAccountAuthSaveReq(Long accountId, List<OrgFundAuthRow> rows) {
}
