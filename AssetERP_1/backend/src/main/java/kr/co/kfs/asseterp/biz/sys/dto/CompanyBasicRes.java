package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 기본정보 탭 행 (AS-IS Sys01_TabPage_Info02 ← sys01_company.selectById). 법인등록번호는 복호화한 값(decCorpRegNo)만 보낸다 */
public record CompanyBasicRes(
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
