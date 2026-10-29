package kr.co.kfs.asseterp.biz.att.dto;

import java.util.List;

/** AS-IS att.Att13_OvertimeReqHist.updateInfo 요청. confirmYn이 있으면 모든 행에 그 값(확정·확정취소), 없으면 행의 값(저장) */
public record AttOvertimeReqUpdateReq(Boolean confirmYn, List<AttOvertimeReqRow> rows) {
}
