package kr.co.kfs.asseterp.biz.emp.dto;

/** 겸직 등록·수정 (AS-IS Emp04_Edit_AddTitle.update: updateModel + transModel + personId) */
public record AddTitleSaveReq(
        Long addTitleId,
        /** 원사원 */
        Long personId,
        /** transModel.personId — 있으면 수정(겸직사원 발령 UPDATE), 없으면 겸직사원 새로 만듦 */
        Long transPersonId,
        String startDate,
        String closeDate,
        Long orgCodeId,
        String orgHeadYn,
        String titleCd,
        String posCd,
        String transReason
) {}
