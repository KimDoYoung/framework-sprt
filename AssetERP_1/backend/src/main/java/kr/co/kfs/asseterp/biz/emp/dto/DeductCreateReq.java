package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** AS-IS Emp35_Popup_DeductCreate.update() → Emp35_Deduct.insert */
public record DeductCreateReq(Long personId, LocalDate startDate) {}
