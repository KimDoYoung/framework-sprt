package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 관리자 화면에서 고칠 수 있는 열: 처리자(confirmNm)·처리일(confirmDate)·처리상태(stateCd) */
public record SpecificMenuRequestAdminSaveReq(Long specificMenuRequestId, String stateCd, String confirmNm, LocalDate confirmDate) {
}
