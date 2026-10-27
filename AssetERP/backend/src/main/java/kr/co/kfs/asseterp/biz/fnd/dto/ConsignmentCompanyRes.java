package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd03_ConsignmentModel (Fnd03_Tab_Consignment — 회사별 수탁사정보 관리 #1051, 기타 수탁사코드 01~10 포함) */
public record ConsignmentCompanyRes(
        Long consignmentId,
        String consignmentCode,
        String consignmentName,
        String useYn,
        String note,
        Long companyId,
        String etcConsignmentCode01,
        String etcConsignmentCode02,
        String etcConsignmentCode03,
        String etcConsignmentCode04,
        String etcConsignmentCode05,
        String etcConsignmentCode06,
        String etcConsignmentCode07,
        String etcConsignmentCode08,
        String etcConsignmentCode09,
        String etcConsignmentCode10
) {
}
