package kr.co.kfs.asseterp.biz.est.dto;

import java.time.LocalDate;

/** 부동산PF 용역계약 등록·수정 (AS-IS est.Est02_PfContract.modelUpdate). pfContractId는 열 때 받은 새 번호(next-id) 또는 수정할 행 */
public record PfContractSaveReq(Long pfContractId, String borrower, String projectSiteName, String projectSiteAddr, Long pfFeeTypeId,
                                LocalDate startDate, LocalDate closeDate, Long managerId, String plan) {
}
