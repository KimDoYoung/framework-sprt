package kr.co.kfs.asseterp.biz.apr.dto;

/** 통합알림 문구에 쓰는 결재문서 (AS-IS apr01_appr.selectById 중 제목·문서분류 전체 경로) */
public record AprAlertAppr(String title, String classTreeNameAllPath) {
}
