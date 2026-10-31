package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** [연관문서설정] [확정] — 창에 보이는 전체 줄 (AS-IS Apr21_RelateAppr.insert의 updateList, V16) */
public record AprAfterApprSaveReq(List<AprApprRelateReq.Appr> apprs) {
}
