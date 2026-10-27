package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd03_Tab_Consignment 저장 요청 (수탁사코드·수탁사명·사용여부·비고·기타 수탁사코드 01~10) */
public record ConsignmentCompanySaveReq(
        Long consignmentId,
        String consignmentCode,
        String consignmentName,
        String useYn,
        String note,
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
