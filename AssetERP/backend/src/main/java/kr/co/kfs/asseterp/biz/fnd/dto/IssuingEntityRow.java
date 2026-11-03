package kr.co.kfs.asseterp.biz.fnd.dto;

/** fnd07_issuing_entity.insertUpdate 파라미터 ([파일업로드]가 한 줄마다 만든다) */
public record IssuingEntityRow(
        Long issuingEntityId,
        String issuingEntityCode,
        String issuingEntityName,
        String issuingEntityAttachCode,
        Long issuingEntityFaceValue,
        String issuingEntitySettleMonth,
        String issuingEntityNationCode,
        String issuingEntityUseYn,
        String issuingEntityNote,
        Long companyId
) {
}
