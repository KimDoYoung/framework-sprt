package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * Ics30_Tab_Compliance 저장 (AS-IS ics.Ics30_Compliance.updateList): 고친·추가한 행(complianceId ≤ 0 이면 새 행)과 지울 id.
 * 회사는 서버가 로그인 회사로 채운다
 */
public record IcsComplianceSaveReq(List<Row> rows, List<Long> deleteIds) {

    public record Row(Long complianceId, LocalDate startDate, String complianceType, String subNum, String content,
                      String naUseYn, String useYn, LocalDate useCloseDate, String note) {
    }
}
