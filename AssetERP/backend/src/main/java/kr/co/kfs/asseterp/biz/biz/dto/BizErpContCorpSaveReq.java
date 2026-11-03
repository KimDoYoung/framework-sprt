package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** Biz51_Edit_ErpContCorp 저장 — erpContCorpId 가 없으면 서버가 새 번호를 받는다(AS-IS insertUpdate). 계약사명(contCorpNm)은 "사용X"라 다루지 않는다 */
public record BizErpContCorpSaveReq(
        Long erpContCorpId,
        Long corpId,
        String contStatusCd,
        String serviceType,
        LocalDate firstContDate,
        LocalDate contDate,
        LocalDate contEndDate,
        LocalDate erpStartDate,
        LocalDate erpEndDate,
        Long companyId,
        String managerNm,
        String managerTel,
        String managerEmail,
        String companyCeo,
        String companyAddr,
        String note
) {
}
