package kr.co.kfs.asseterp.biz.tdm.dto;

/** 불러오기 원본 점검항목의 회사·부서·코드 (copyManlList의 코드 중복 검사용) */
public record ManlSourceRes(Long companyId, Long orgId, String manlCode) {
}
