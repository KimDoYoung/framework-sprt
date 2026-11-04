package kr.co.kfs.asseterp.biz.crm.dto;

import java.util.List;

/** AS-IS Crm14_Lookup_ShareDefault·Crm15_Lookup_Share.update — 지울 줄 번호와 새로 넣을 줄 */
public record CrmShareSaveReq(List<Long> deleteIds, List<Row> rows) {
    public record Row(String shareCode, Long personId, Long orgId) {
    }
}
