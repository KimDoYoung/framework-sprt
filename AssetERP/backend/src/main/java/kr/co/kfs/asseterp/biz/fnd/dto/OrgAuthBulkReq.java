package kr.co.kfs.asseterp.biz.fnd.dto;

import java.util.List;

/** AS-IS Fnd08_OrgAuth.updateAuthYn 요청 — 펀드 × 조직 전부에 권한 부여(confirm "true") 또는 삭제("false") */
public record OrgAuthBulkReq(List<Long> fundCodeIds, List<Long> orgCodeIds, String confirm) {
}
