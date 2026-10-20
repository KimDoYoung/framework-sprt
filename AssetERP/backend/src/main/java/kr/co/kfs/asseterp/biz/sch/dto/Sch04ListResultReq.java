package kr.co.kfs.asseterp.biz.sch.dto;

/** 처리결과 및 확인 (AS-IS Sch04_Lookup_IcsMsg.update): type U 처리결과 저장(note) / P 확인 / C 확인취소 */
public record Sch04ListResultReq(String type, String note) {
}
