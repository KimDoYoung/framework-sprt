package kr.co.kfs.asseterp.biz.bbs.dto;

/** 신청구분 내용 양식(AS-IS Bbs12_ApplicationFormModel) */
public record ApplicationFormRes(Long applicationFormId, Long companyId, String appType, String appTypeName, String content,
                                 String contentMobi, Boolean publicYn) {
}
