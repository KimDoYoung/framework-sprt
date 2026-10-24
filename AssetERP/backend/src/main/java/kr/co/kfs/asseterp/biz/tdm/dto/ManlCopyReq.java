package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/**
 * 점검항목 불러오기 (AS-IS tdm.Tdm43_Manl.copyManlList): 고른 원본 점검항목 manlIds를 관리의무(manlDutyId)에 복사한다.
 * 관리의무 값은 위 그리드 행의 값이다(AS-IS도 화면 모델을 그대로 보냈다).
 */
public record ManlCopyReq(Long manlOrgId, Long orgId, Long exctId, Long roleId, String roleName, Long taskId, String taskName,
                          Long taskRelateDetailId, String taskRelateDetailName, Long taskRelateDutyId, String taskRelateDutyName,
                          Long manlDutyId, List<Long> manlIds) {
}
