package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** Icam50_SourceModel 중 Icam50_Tab_DbSource 그리드 열 + 보기 창에 보이는 소스 내용(text) */
public record IcamSourceRes(String sourceId, LocalDate stdDate, String serverType, String owner, String type, String name,
                            Long lineCnt, String workDateString, String text) {
}
