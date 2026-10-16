package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 기타정보 탭 (AS-IS Emp02_OthersModel — selectByText 행의 empOthersModel). 이름(f_cdnm)은 콤보가 코드로 보여 싣지 않는다 */
public record OthersRes(
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
