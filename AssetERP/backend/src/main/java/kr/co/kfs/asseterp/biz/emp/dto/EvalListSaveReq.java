package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 인사평가 항목 저장 (AS-IS emp.Emp41_EvalList.updateList) — 변경·추가 행과 삭제대기 ID를 한 번에 보낸다 */
public record EvalListSaveReq(Long evalListStdId, List<Row> rows, List<Long> deleteIds) {

    /** evalListId가 없거나 0 이하면 새 행 */
    public record Row(Long evalListId, String evalClassCode, String content, Long weightMember, Long weightLeader, Long seq) {
    }
}
