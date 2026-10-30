package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** [일괄저장] (AS-IS biz.Biz01_Promo.updateRealPersonId) — realPersonId가 없으면 '공통'(실사용자 비움) */
public record BizCardUserAllocationUpdateReq(List<Long> promoIds, Long realPersonId) {
}
