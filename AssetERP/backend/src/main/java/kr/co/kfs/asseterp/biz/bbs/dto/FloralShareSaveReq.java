package kr.co.kfs.asseterp.biz.bbs.dto;

import java.util.List;

/** AS-IS Bbs21_Lookup_FloralRequestShare.update — 지울 행 ID와 새로 넣을 행 */
public record FloralShareSaveReq(List<Long> deleteIds, List<Row> rows) {
    public record Row(Long floralRequestShareId, String shareCode, Long personId, Long orgId) {
    }
}
