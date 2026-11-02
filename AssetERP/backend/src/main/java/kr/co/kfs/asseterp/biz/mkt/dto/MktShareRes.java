package kr.co.kfs.asseterp.biz.mkt.dto;

/** AS-IS Mkt05_ShareModel (selectByParentId) — shareCode 1 사원 / 2 부서. 저장 요청에서는 shareId가 0 이하면 새 행 */
public record MktShareRes(
        Long shareId,
        Long parentId,
        String shareCode,
        Long personId,
        Long orgId,
        String shareName,
        String personName,
        String orgName) {
}
