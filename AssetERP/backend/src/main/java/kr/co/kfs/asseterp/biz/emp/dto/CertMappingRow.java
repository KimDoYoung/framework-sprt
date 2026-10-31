package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 증명서 양식 치환 열 (AS-IS Emp15_CertModel 중 Emp15_Tab_Cert.createMapping이 읽는 값, V22) */
public record CertMappingRow(
        Long certId,
        LocalDate issueDate,
        String linkCode,
        String personNo,
        LocalDate hireDate,
        String companyName,
        String companyAddress,
        LocalDate birthDay,
        String personCtzNo,
        String personAddress,
        String orgName,
        String companyAgent,
        String certUseName,
        String linkName,
        String personName,
        String personPos,
        String personTitle,
        String retireDate,
        String rewardList,
        String transList
) {
}
