package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 가족사항 저장 요청 */
public record FamilySaveReq(
        Long familyId,
        Long personId,
        String familyNm,
        String relationCd,
        String locateCd,
        String disabilityGrade,
        LocalDate birthday,
        String familySchool,
        String familyJob,
        String schoolLocation,
        String familyLocation,
        String note
) {}
