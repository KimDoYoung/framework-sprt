package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 부서 책무매뉴얼 ID 목록 (AS-IS notManlOrgList 의 manlOrgList) */
public record ManlOrgIdsReq(List<Long> manlOrgIds) {
}
