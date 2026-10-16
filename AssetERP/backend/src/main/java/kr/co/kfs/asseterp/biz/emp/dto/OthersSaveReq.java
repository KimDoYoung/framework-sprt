package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 기타정보 탭 저장 (AS-IS Emp02_TabPage_Others.update → Emp02_Others.updateOne, emp02_others.upsert 파라미터) */
public record OthersSaveReq(
        Long othersId,
        Long personId,
        String chnName,
        String engName,
        String decCtzNo,
        LocalDate birthday,
        String lunarCode,
        String genderCode,
        String nationCode,
        String emailOther,
        String militaryCode,
        String familyDscr,
        String marriageCode,
        String zipCode,
        String zipAddress,
        String zipDetail,
        String homeTelNo,
        String note,
        LocalDate hireDateGroup,
        LocalDate hireDateLeaveCalc
) {
}
