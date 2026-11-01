package kr.co.kfs.asseterp.biz.emp.dto;

/** 출장·외출 공유지정 한 줄 (AS-IS emp56_share.selectByParentId — Emp56_ShareModel) */
public record ShareRes(Long shareId, Long parentId, String shareCode, String shareName, Long personId, String personName,
                       Long orgId, String orgName) {
}
