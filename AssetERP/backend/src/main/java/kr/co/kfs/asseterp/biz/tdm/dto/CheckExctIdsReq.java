package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 임원 승인현황 ID 목록 (AS-IS tdm.Tdm53_ChckExct.deleteList) */
public record CheckExctIdsReq(List<Long> chckExctIds) {
}
