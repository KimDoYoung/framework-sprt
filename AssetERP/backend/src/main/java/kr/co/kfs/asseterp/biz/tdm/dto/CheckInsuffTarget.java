package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인요청·취소 때 상태가 함께 바뀌는 미흡/개선 조치내역 (AS-IS tdm54_chck_insuff.selectApprTarget) */
public record CheckInsuffTarget(Long chckInsuffId, Long companyId) {
}
