package kr.co.kfs.asseterp.biz.mkt.dto;

import java.time.LocalDate;
import java.util.List;

/** AS-IS Mkt03_History.updateOne + Mkt04_RelateFund.updateByList — historyId가 이미 있으면 UPDATE(작성자만), 없으면 INSERT. fundIds가 비어 있지 않을 때만 연결펀드를 통째로 다시 넣는다(원본 그대로) */
public record MktHistorySaveReq(
        Long historyId,
        Long targetCompanyId,
        LocalDate activityDate,
        String activityTitle,
        String activityContent,
        List<Long> fundIds) {
}
