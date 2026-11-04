package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Att03_Lookup_OvertimeReq.updateChk01~02 + update — baseDate는 화면의 근무일자(주간 합계 기준), rows는 그리드의 모든 행(중복·합계 검사에 쓴다),
 * deleteIds는 화면에서 뺀 하위 행(deleteList). changed가 true인 행만 저장한다. overtimeReqId가 0 이하이면 새 행.
 */
public record AttMyOvertimeSaveReq(LocalDate baseDate, List<Row> rows, List<Long> deleteIds) {
    public record Row(Long overtimeReqId, LocalDate workDate, String workTypeCode, Long overtimeMin, String reason,
                      String workRewardTypeCode, boolean changed) {
    }
}
