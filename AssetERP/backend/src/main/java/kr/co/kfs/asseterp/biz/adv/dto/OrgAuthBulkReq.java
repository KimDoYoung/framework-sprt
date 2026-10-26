package kr.co.kfs.asseterp.biz.adv.dto;

import java.util.List;

/** AS-IS Adv05_OrgAuth.updateAuthYn 요청 — 계좌 × 조직 전부에 권한 부여(confirm "true") 또는 삭제("false") */
public record OrgAuthBulkReq(List<Long> accountIds, List<Long> orgCodeIds, String confirm) {
}
