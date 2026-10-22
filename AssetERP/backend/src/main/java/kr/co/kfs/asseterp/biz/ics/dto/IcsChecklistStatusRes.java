package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/**
 * 내부통제내역 현황 그리드 한 행 (K07, AS-IS sys99_print.selectIcsCheckListStatus — Sys99_PrintModel string01~03·long01·string11~22).
 * months는 1~12월 12칸("O / X"=체크·확인 여부, 기준월 이후는 "-"). 분기 체크주기는 3·6·9·12번째 칸을 1~4분기로 쓴다
 */
public record IcsChecklistStatusRes(Long checklistId, String checkLClassName, String checkMClassName, String content, List<String> months) {
}
