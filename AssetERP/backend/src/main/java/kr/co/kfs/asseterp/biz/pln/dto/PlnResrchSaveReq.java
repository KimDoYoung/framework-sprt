package kr.co.kfs.asseterp.biz.pln.dto;

import java.time.LocalDate;

/**
 * 리서치 일정 저장 (AS-IS pln.Pln03_Resrch.update — pln03_resrch.insert 업서트). resrchId는 창을 열 때 받은 번호.
 * 등록자·등록일·완료·확인일은 서버가 정한다(새 건은 로그인 사원·오늘)
 */
public record PlnResrchSaveReq(Long resrchId, Long classTreeId, Long issuingEntityId, String visitReason, LocalDate resrchStartDate,
                               LocalDate resrchCloseDate, Long cfrmPersonId, String note, String targetTypeCode) {
}
