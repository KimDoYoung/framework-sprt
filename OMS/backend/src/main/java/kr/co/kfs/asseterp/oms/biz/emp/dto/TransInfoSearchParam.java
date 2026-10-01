package kr.co.kfs.asseterp.oms.biz.emp.dto;

/**
 * 사원 검색 조건 (AS-IS Emp00_TransInfo.selectByText / selectOneByPersonId 파라미터 Map)
 *
 * @param searchText         성명+조직명+사번 LIKE 패턴
 * @param transCode          재직구분: 100 재직, 800 겸직, 900 퇴직, 000 전체 (selectOneByPersonId는 '%')
 * @param transDate          기준일 yyyy-MM-dd
 * @param isSeparateAddTitle true면 재직에서 겸직 제외
 * @param personId           단건 (selectOneByPersonId)
 */
public record TransInfoSearchParam(Long companyId, String searchText, String transCode, String transDate,
                                   boolean isSeparateAddTitle, Long orgCodeId, Long personId) {
}
