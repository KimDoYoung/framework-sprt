package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 일괄점검취소 (AS-IS tdm.Tdm52_ChckManl.batchCancelComplete) */
public record CheckManlIdsReq(List<Long> chckManlIds) {
}
