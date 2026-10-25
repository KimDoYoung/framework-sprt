package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검상세 창 [저장] (AS-IS tdm.Tdm52_ChckManl.modelUpdate — 점검일자·점검결과·점검의견) */
public record CheckManlSaveReq(String checkDate, String checkResultCode, String checkCmnt) {
}
