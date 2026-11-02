package kr.co.kfs.asseterp.biz.kfs.dto;

import java.time.LocalDate;

/** 리모트뷰 사용기록 한 행 — AS-IS Kfs01_RemoteViewModel (kfs01_remote_view.selectByText). managerYn은 varchar 'true'/'false' */
public record RemoteViewRes(Long remoteViewId, String personName, LocalDate date, String startTime, String closeTime, String reason, Boolean managerYn) {
}
