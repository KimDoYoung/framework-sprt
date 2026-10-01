package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 서버사용량 조회 조건 (AS-IS 파라미터 Map: useYn, locName, year) */
public record FileUsageParam(String useYn, String locNm, String year) {
}
