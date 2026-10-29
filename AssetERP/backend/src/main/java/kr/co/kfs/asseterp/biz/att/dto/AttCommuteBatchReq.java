package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;
import java.util.List;

/** 근태 일괄생성 본문 (AS-IS Att02_Lookup_InsertBatch.update → att.Att02_Commute.insertBatch) */
public record AttCommuteBatchReq(LocalDate startDate, LocalDate closeDate, List<Long> personIds) {
}
