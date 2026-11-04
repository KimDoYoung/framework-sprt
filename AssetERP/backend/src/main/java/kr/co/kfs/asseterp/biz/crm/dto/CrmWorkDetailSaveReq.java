package kr.co.kfs.asseterp.biz.crm.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 업무활동내역 저장 (AS-IS crm.Crm12_WorkDetail.modelUpdate + crm.Crm13_RelateFund.updateList).
 * workDetailId는 창을 열 때 받은 번호(새 건도 먼저 받는다). fundIds = 그리드에 있는 연결펀드(펀드 번호)
 */
public record CrmWorkDetailSaveReq(Long workDetailId, Long contactId, LocalDate workDate, String workName, String workContent,
                                   boolean privateYn, List<Long> fundIds) {
}
