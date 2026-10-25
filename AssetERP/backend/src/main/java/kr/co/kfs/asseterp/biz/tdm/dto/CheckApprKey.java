package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인 행의 회사·점검년월·직책 (서버가 승인 행 ID로 다시 읽는 데 쓴다) */
public record CheckApprKey(Long companyId, String checkYm, Long roleId) {
}
