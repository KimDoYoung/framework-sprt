package kr.co.kfs.asseterp.biz.rpt.dto;

import java.util.List;

/** 주간업무구분 미사용 저장 (AS-IS Rpt05_WeekBizClass.upsert) */
public record WeekBizClassSaveReq(List<Item> items) {
    public record Item(String weekBizType, boolean unUseYn) {
    }
}
