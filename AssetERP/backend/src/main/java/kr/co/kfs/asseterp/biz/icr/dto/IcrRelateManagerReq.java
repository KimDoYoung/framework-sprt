package kr.co.kfs.asseterp.biz.icr.dto;

/** 내규 관리그룹 지정 (AS-IS icr.Icr05_RelateManager.relateUpdate): 내규 하나를 관리그룹 하나에 연결한다 */
public record IcrRelateManagerReq(Long managerId, Long classTreeId) {
}
