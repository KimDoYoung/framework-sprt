package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 점검자 지정 (AS-IS tdm.Tdm52_ChckManl.updateCheckerId — 점검항목 목록 + 점검자) */
public record CheckCheckerReq(List<Long> chckManlIds, Long personId) {
}
