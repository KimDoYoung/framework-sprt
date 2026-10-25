package kr.co.kfs.asseterp.biz.tdm.dto;

/** 임원 승인현황 그리드 한 행 (AS-IS Tdm53_ChckExctModel — selectByChckJobId) */
public record CheckExctRes(Long chckExctId, Long chckJobId, Long roleId, Long exctId, String roleName, String exctName,
                           Long chckManlCnt, Boolean exctApprYn, Boolean lockYn, Integer buttonEnable) {
}
