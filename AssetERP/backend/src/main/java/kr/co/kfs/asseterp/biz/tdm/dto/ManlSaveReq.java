package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/**
 * 점검항목 저장 (AS-IS tdm.Tdm43_Manl.modelUpdate). manlId는 등록창을 열 때 받은 번호(`next-id`) — 이미 있으면 수정, 없으면 등록.
 * relate*는 창을 연 뒤 새로 고른 연관 항목 ID(이미 연결된 것은 서버가 건너뜀). startDate는 yyyy-MM-dd.
 */
public record ManlSaveReq(Long manlId, Long manlOrgId, Long orgId, Long exctId, Long roleId, String roleName,
                          Long taskId, String taskName, Long taskRelateDetailId, String taskRelateDetailName,
                          Long taskRelateDutyId, String taskRelateDutyName, Long manlDutyId,
                          String checkItem, String checkCycleCode, String checkMonth, String checkEvidDocName,
                          String checkHow, String refBasis, String startDate, String ceoDutyCode,
                          String exctDutyMap, String importLevelCode,
                          List<Long> relateIcsClassTreeIds, List<Long> relateIcrClassTreeIds,
                          List<Long> relateFormFileIds, List<Long> relateDcrClassTreeIds) {
}
