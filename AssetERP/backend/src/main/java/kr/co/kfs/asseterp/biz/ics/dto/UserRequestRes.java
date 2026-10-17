package kr.co.kfs.asseterp.biz.ics.dto;

public record UserRequestRes(Long userRequestId, Long companyId, String companyName, Long personId, String personName,
                             String regDate, String lawTitle, String lawContent, String submitTo, String relatedLaw,
                             String reportCycle, String result, String note, String stateCode, String stateName,
                             String closeDate, String confirmYn) {
}
