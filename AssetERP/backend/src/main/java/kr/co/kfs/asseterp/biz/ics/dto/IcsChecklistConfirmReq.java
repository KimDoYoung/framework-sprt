package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/**
 * 확인(true)·확인취소(false) (AS-IS ics.Ics15_ChecklistWrite.updateConfirmYn) — yyyymm = 'yyyy.MM'(기준 분기(월)의 달).
 * 고른 행은 (체크리스트 id, 작성자 id)로 가리킨다
 */
public record IcsChecklistConfirmReq(Boolean confirmYn, String yyyymm, String cycleType, List<Target> rows) {

    public record Target(Long checklistId, Long personId) {
    }
}
