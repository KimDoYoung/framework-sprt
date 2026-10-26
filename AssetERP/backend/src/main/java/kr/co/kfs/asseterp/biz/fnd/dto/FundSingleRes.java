package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 연관펀드 단일 선택 조회창 한 행 (P12, AS-IS Fnd00_FundModel 중 Fnd01_Lookup_SelectSingle 그리드 열) */
public record FundSingleRes(Long fundId, String fundCode, String ksdFundCode, String fundName, String kofiaFundTypeName,
                            String kofiaClassTypeName, String kofiaTrustName, LocalDate startDate, String empName1, String note) {
}
