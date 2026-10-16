package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 개선사항 및 오류 통보 사용자 조회 조건 (AS-IS Sys90_Tab_AfterService.retrieve() L184-231 / 서버 selectBySearchText L96-131) */
public record AfterServiceUserSearchParam(
        Long companyId,
        LocalDate happenStartDate,
        LocalDate happenEndDate,
        String typeYn,
        String stateCode,
        String confirmYn,
        String searchText
) {
}
