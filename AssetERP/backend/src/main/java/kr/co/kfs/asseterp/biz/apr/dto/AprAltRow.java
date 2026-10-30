package kr.co.kfs.asseterp.biz.apr.dto;

/** apr07_alt_appr.selectOneByEmpId·selectOneByOrgEmpId 중 이름 문구에 쓰는 것 (V01) */
public record AprAltRow(Long altEmpId, String stampYn, String targetTitleName, String targetEmpName, String targetOrgName,
                        String altTitleName, String altEmpName, String altOrgName) {
}
