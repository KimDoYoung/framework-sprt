package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Att05_Lookup_PmWork.updateChk01~03 + update — baseDate는 화면의 신청일자, rows는 그리드의 모든 행(중복 검사에 쓴다).
 * changed가 true인 행만 저장한다. pmWorkId가 0 이하이면 새 행.
 */
public record AttPmWorkSaveReq(LocalDate baseDate, List<Row> rows) {
    public record Row(Long pmWorkId, LocalDate workDate, String reason, boolean changed) {
    }
}
