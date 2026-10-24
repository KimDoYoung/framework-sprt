package kr.co.kfs.asseterp.biz.tdm.dto;

/** tdm41_manl_duty.selectByOrgIdPaging 파라미터 — searchText는 '%글자%' */
public record ManlDutyRegParam(Long manlJobId, Long roleId, Long taskId, Long orgId, String searchText, long limit, long offset) {
}
