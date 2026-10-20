package kr.co.kfs.asseterp.biz.cmp.dto;

/** 공용메일 검증 결과 (AS-IS ServiceResult status 1 = ok, 그 밖 = 실패, message는 그대로 화면에 보인다) */
public record CmpMailCheckRes(boolean ok, String message) {
}
