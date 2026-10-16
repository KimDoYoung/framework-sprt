package kr.co.kfs.asseterp.biz.emp.dto;

/** 경력사항 행 (AS-IS Emp07_CareerModel) */
public record CareerRes(
        Long careerId,
        Long personId,
        String frYm,
        String toYm,
        String companyNm,
        String industry,
        String finalOrg,
        String finalTitle,
        String careerTyCd,
        String careerTyNm,
        String finalRole,
        String financeRelateYn,
        String mainCareerYn,
        String extrAddTitleYn,
        String note
) {}
