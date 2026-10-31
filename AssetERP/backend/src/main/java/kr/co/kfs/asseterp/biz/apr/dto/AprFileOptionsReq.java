package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** [첨부파일 옵션설정]의 [저장] — 줄마다 출력·확장자 표시와 순서 (AS-IS Sys10_File.updateOthers) */
public record AprFileOptionsReq(List<Item> items) {
    public record Item(Long fileId, boolean printYn, boolean extYn, String seq) {
    }
}
