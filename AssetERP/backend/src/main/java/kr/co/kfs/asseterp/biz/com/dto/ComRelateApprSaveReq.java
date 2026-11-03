package kr.co.kfs.asseterp.biz.com.dto;

import java.util.List;

/** 증빙자료 연결 추가 (AS-IS com.Com01_RelateAppr.modelUpdate·listUpdate) — 문서(apprIds)마다 연결 한 행. keyTable 은 연결 테이블명 앞 5자리 */
public record ComRelateApprSaveReq(String keyTable, Long keyTableId, List<Long> apprIds) {
}
