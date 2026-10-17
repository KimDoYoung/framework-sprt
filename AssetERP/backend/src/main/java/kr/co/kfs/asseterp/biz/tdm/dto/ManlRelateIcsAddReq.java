package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 점검항목 연결 (Ics01_Lookup_RelateTdm.lookupSelectTdm → tdm.Tdm45_ManlRelateIcs.insertList): 법규 id와 고른 점검항목 id 목록 */
public record ManlRelateIcsAddReq(Long icsId, List<Long> manlIds) {
}
