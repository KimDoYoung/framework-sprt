package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd07_IssuingEntityModel 중 Fnd07_Tab_IssuingEntity 그리드 열 (+ id·회사·국가코드). kukaName은 SQL 계산 열(f_cdnm EmpNationCode) */
public record IssuingEntityRes(
        Long issuingEntityId,
        String issuingEntityCode,
        String issuingEntityName,
        String issuingEntityAttachCode,
        Long issuingEntityFaceValue,
        String issuingEntitySettleMonth,
        String issuingEntityNationCode,
        String kukaName,
        String issuingEntityUseYn,
        String issuingEntityNote,
        Long companyId
) {
}
