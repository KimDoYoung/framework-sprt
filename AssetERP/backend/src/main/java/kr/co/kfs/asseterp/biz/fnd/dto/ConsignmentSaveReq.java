package kr.co.kfs.asseterp.biz.fnd.dto;

/** 그리드에서 고칠 수 있는 열: 수탁사코드·수탁사명·비고 (사용여부는 체크 표시만) */
public record ConsignmentSaveReq(Long consignmentId, String consignmentCode, String consignmentName, String useYn, String note) {
}
