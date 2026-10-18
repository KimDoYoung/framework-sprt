package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** 문서양식 내보내기 (Dcr05_Tab_DocType.pushData) — 고른 양식(sourceCompanyId 회사 것)을 targetCompanyId 회사에 새 양식으로 복사 */
public record DcrDocTypePushReq(Long targetCompanyId, Long sourceCompanyId, List<Long> docTypeIds) {
}
