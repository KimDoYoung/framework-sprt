package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y04 외출 한 줄 (AS-IS Emp54_ErrandModel — emp54_errand.selectByDate/selectById) */
public record MyErrandRes(Long errandId, Long personId, String personName, String orgName, String errandCode, String errandName,
                        LocalDate date, String weekday, String departTime, String returnTime, String reason, String venue,
                        String host, String note, Long apprId, String aprStatusCode, String aprStatusName, Boolean publicYn,
                        String shareInfo) {
}
