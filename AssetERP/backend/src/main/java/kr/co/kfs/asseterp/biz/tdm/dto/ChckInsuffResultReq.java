package kr.co.kfs.asseterp.biz.tdm.dto;

/** 조치결과 저장·조치완료·완료취소 요청 (AS-IS Tdm54_ChckInsuff.updateComplete — procType U 저장·P 조치완료·C 완료취소). 날짜는 'yyyy-MM-dd' */
public record ChckInsuffResultReq(String procType, String dueDate, String actionDate, Long actionEmpId, String actionCmnt) {
}
