package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검항목 생성 전 검사 (AS-IS tdm.Tdm50_ChckJob.preCreateCheckManl — status 1 바로 진행, 2 확인 뒤 진행(message), 실패는 오류) */
public record CheckPreCreateRes(int status, String message) {
}
