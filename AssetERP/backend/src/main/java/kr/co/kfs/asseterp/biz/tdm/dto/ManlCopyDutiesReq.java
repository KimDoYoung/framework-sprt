package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 관리의무 단위 불러오기 (AS-IS tdm.Tdm43_Manl.copyDutyList): 고른 원본 주요관리의무의 점검항목을 이 작업·직책·부서에 복사한다 */
public record ManlCopyDutiesReq(Long manlJobId, Long roleId, Long orgId, List<Source> sources) {

    /** 원본 주요관리의무 (Tdm43_ManlModel 중 복사 조건에 쓰는 값) */
    public record Source(Long manlOrgId, Long roleId, Long orgId, Long taskId, Long taskRelateDetailId, Long taskRelateDutyId) {
    }
}
