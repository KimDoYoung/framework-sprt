package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 가족사항 행 (AS-IS Emp06_FamilyModel) */
public record FamilyRes(
        Long familyId,
        Long personId,
        String familyNm,
        String relationCd,
        String locateCd,
        String locateNm,
        String disabilityGrade,
        LocalDate birthday,
        String familySchool,
        String familyJob,
        String schoolLocation,
        String familyLocation,
        String note
) {}
