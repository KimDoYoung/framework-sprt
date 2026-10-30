package kr.co.kfs.asseterp.biz.biz.dto;

/** [저장] 한 행 (AS-IS biz.Biz03_AccountMap.update). accountMapId가 0 이하면 새 행(INSERT), 아니면 계정과목만 바꾼다 */
public record BizAccountMapSaveReq(Long accountMapId, String useItemCode, Long accountCodeId) {
}
