package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 화면안내 차단 목록 한 행 (AS-IS Emp91_MenuInfoNoticeModel): 메뉴명·차단일자, 보기용 메뉴 번호·안내문 */
public record MenuInfoNoticeRes(
        Long menuInfoNoticeId,
        String menuName,
        LocalDate date,
        String menuNo,
        String menuNote
) {
}
