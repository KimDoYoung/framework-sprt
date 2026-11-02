package kr.co.kfs.asseterp.biz.rpt.dto;

import java.util.List;

/** 주간업무보고 순서 저장 — ▲▼로 바뀐 행 (AS-IS Rpt03_Week.inUpdateData가 바꾸는 값은 seq뿐) */
public record WeekSeqReq(List<Item> items) {
    public record Item(Long weekId, Long seq) {
    }
}
