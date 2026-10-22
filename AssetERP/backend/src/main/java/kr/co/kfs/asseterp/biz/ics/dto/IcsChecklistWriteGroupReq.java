package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/** 담당그룹 일괄지정 (AS-IS Ics11_ChecklistCompany.updateWriteGroupId): writeGroupId가 null이면 지정 해제. checklists의 useYn은 ics11 행이 없을 때 새 행에 넣는 값 */
public record IcsChecklistWriteGroupReq(Long writeGroupId, List<IcsChecklistUseYnReq> checklists) {
}
