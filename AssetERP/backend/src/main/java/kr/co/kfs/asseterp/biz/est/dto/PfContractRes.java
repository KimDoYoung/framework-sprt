package kr.co.kfs.asseterp.biz.est.dto;

import java.time.LocalDate;

/**
 * 부동산PF 용역계약 한 행 (AS-IS est02_pf_contract.selectByText·selectById). feeName은 코드 EstPfFeeCode의 이름, managerInfo는 "담당 조직 이름 성명 (전화, 메일)",
 * managerOrgId는 수행시작일 기준 담당자 조직(작성자 조직원 검사용). 첨부 파일 목록 열(fileListHtml·fileListResultHtml)은 결재 문서 양식 채우기용이라 다음 단계에서 더한다
 */
public record PfContractRes(Long pfContractId, String borrower, String projectSiteName, String projectSiteAddr,
                            Long pfFeeTypeId, String feeCode, String feeName, LocalDate startDate, LocalDate closeDate,
                            Long managerId, String managerName, String managerInfo, Long managerOrgId, String plan,
                            Long planApprId, String planApprStatusName, Long resultApprId, String resultApprStatusName) {
}
