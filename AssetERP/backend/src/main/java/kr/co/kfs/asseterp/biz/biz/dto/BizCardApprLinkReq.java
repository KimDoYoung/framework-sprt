package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/**
 * #1131 법인카드 상신 연결 (원본 2026-11-06: Apr01_Edit_ApprDoc A41 저장 때 createCardExcel2 + Biz01_Tab_Card.updateApprId → biz.Biz01_Promo.updateByApprId).
 * promoIds = 상신한(고른) 내역, titleName = 문서 제목(첨부 엑셀 파일 이름)
 */
public record BizCardApprLinkReq(Long apprId, List<Long> promoIds, String titleName) {
}
