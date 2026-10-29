package kr.co.kfs.asseterp.biz.bmt.dto;

/** 임직원 정보통신수단 한 줄 (AS-IS Bmt12_PcHistoryModel — 그리드에 쓰는 열만) */
public record BmtEmpIctRes(Long pcHistoryId, String personName, String messenger, String website,
                           String internalIp, String astClassTreeName, String spec, String etc) {
}
