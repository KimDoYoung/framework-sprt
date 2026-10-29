package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 확정 출퇴근시간 수정 본문. 개별수정(Att02_Edit_Commute → att.Att04_CommuteHist.insert)은 commuteIds가 한 건,
 * 일괄수정(Att02_Edit_CommuteBatch → insertList)은 여러 건. 체크하지 않은 쪽은 날짜·시각이 모두 null
 */
public record AttCommuteHistReq(List<Long> commuteIds, LocalDate checkInTime, String checkInTimeStr,
                                LocalDate checkOutTime, String checkOutTimeStr) {
}
