package kr.co.kfs.asseterp.biz.emp.dto;

/** 경력사항 저장 요청 */
public record CareerSaveReq(
        Long careerId,
        Long personId,
        String frYm,
        String toYm,
        String companyNm,
        String industry,
        String finalOrg,
        String finalTitle,
        String careerTyCd,
        String finalRole,
        String financeRelateYn,
        String mainCareerYn,
        String extrAddTitleYn,
        String note
) {}
