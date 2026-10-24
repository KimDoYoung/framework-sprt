package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/**
 * 부서변경 (AS-IS tdm.Tdm41_ManlDuty.changeOrgId2): 직책(manlJobId·roleId)의 고른 책무·담당부서 행들을 새 부서(orgId)로.
 * AS-IS는 화면 모델 목록을 통째로 보냈지만 서버가 쓰는 것은 manlJobId·roleId·taskId·기존 orgId·exctId뿐이라 필요한 값만 받고 exctId는 서버가 읽는다
 */
public record ManlDutyChangeOrgReq(Long manlJobId, Long roleId, Long orgId, List<Item> items) {
    /** taskId = 책무, orgId = 지금의 담당부서 */
    public record Item(Long taskId, Long orgId) {
    }
}
