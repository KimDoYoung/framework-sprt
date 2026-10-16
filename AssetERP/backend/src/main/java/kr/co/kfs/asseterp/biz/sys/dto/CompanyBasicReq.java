package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 기본정보 탭 저장 (AS-IS Sys01_TabPage_Info02.updateCorpRegNo → getCorpRegNo → Sys01_Company.update). 그리드에서 편집하는 컬럼만 */
public record CompanyBasicReq(
        Long companyId,
        LocalDate startDate,
        String bizNo,
        String decCorpRegNo,
        String empInfo,
        String mobileTelNo,
        String officeTelNo,
        String officeFaxNo,
        String emailAddr,
        String zipCd,
        String zipAddr,
        String zipDetail) {
}
