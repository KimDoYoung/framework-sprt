package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** [연관법규 추가/수정/삭제]의 [저장] — 화면에 남은 줄 전체와 지운 줄 (AS-IS Apr20_RelateIcs.check + deleteList) */
public record AprRelateIcsSaveReq(List<AprRelateIcsSaveRow> rows, List<Long> deleteIds) {
}
