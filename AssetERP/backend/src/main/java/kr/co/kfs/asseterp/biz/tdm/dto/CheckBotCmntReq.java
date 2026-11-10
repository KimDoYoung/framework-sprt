package kr.co.kfs.asseterp.biz.tdm.dto;

/** AS-IS tdm.Tdm52_ChckManl.getBotCheckCmnt 의 manlModel 중 쓰는 칸 — 화면의 현재 값(editDriver.flush) */
public record CheckBotCmntReq(String checkItem, String checkHow, String checkResultName) {
}
