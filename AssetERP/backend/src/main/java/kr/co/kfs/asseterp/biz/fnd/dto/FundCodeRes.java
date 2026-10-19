package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDateTime;

public record FundCodeRes(Long fundCodeId, String fundCode, String fundName, String kofiaFundTypeName, LocalDateTime startDate,
                          LocalDateTime endDate, String closeName, String kofiaTrustName, String kofiaPublicName, String orgCodeName,
                          String operator1, String operator2, String note, Long apprCount) {
}
