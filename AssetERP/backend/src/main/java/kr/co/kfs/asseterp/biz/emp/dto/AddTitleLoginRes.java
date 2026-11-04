package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 겸직전환 창 한 줄 (AS-IS Emp04_AddTitleModel: 본업무·부서·직책·미결함·겸직종료일). addPersonId = 그 직책으로 로그인할 사원 ID */
public record AddTitleLoginRes(Long addPersonId, Boolean mainTitleYn, String orgName, String orgFullName, String titleName,
                               Long outstandingCnt, LocalDate closeDate) {
}
