package kr.co.kfs.asseterp.biz.batch.dto;

/** 수신한 보유주식(ifi34)의 회사·기준일(yyyyMMdd) 조합 */
public record BatchHoldStdDate(Long companyId, String stdDate) {
}
