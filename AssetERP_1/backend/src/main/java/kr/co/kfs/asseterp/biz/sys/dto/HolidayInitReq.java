package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 기초데이터생성 (AS-IS Sys14_Holiday.insertInitData): 고른 일자('YYYY-MM-DD')의 admin(회사 0) 휴일을 companyId 회사로 복사 */
public record HolidayInitReq(Long companyId, List<String> days) {
}
