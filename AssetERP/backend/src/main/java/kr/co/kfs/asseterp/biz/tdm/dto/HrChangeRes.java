package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 인사정보 가져오기 창 한 행 (AS-IS tdm01_hr.selectPersonModifyed → Tdm01_HrModel) */
public record HrChangeRes(
        Long hrId,
        String changeTypeCode,
        String changeTypeName,
        Long personId,
        String personName,
        String befPosName,
        String befTitleName,
        String befOrgName,
        LocalDate befHireDate,
        LocalDate befRetireDate,
        LocalDate befEndDate,
        String aftPosName,
        String aftTitleName,
        String aftOrgName,
        LocalDate aftHireDate,
        LocalDate aftRetireDate,
        LocalDate aftEndDate
) {
}
