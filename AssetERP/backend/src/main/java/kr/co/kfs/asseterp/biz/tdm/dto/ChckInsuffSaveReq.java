package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 조치계획 등록창 [저장] (AS-IS tdm.Tdm54_ChckInsuff.modelUpdate) — chckInsuffId가 없으면 최초등록.
 * 회사·직책·부서·발생년월·상태는 서버가 점검항목에서 채운다. stdDate는 이력(tdm55) 처리자 정보의 기준일(점검년월 1일)
 */
public record ChckInsuffSaveReq(Long chckInsuffId, Long chckManlId, String regDate, String dueDate, Long planActionEmpId,
                                String actionName, String actionPlan, String stdDate) {
}
