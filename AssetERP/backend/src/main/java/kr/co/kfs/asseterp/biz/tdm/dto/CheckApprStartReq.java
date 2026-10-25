package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 승인시작/승인시작취소 요청 — actionType P·C. 대상 점검항목·미흡 내역 ID는 화면 그리드에서 정한 그대로 (AS-IS와 같다) */
public record CheckApprStartReq(String actionType, List<Long> chckManlIds, List<Long> chckInsuffIds) {
}
