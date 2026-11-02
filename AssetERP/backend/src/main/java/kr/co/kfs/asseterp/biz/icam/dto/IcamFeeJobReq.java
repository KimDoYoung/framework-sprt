package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/**
 * 펀드보수 발생내역 가져오기 창(Icam10_Lookup_getICAM)의 [보수발생내역 가져오기]·[보수원장 재생성]·[보수인출거래 재생성] 요청.
 * corpId: 사무관리보수(20407)는 고른 운용사(전체면 null), 그 밖은 서버가 로그인 회사로 정한다. corpCode·fundCode는 비면 "%"
 */
public record IcamFeeJobReq(String feeType, LocalDate startDate, LocalDate closeDate, Long corpId, String corpCode, String fundCode) {
}
