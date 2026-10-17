package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd03_ConsignmentModel 중 Fnd03_Tab_ConsignmentManager 그리드 열 (+ 저장에 쓰는 id·회사) */
public record ConsignmentRes(Long consignmentId, String consignmentCode, String consignmentName, String useYn, String note, Long companyId) {
}
