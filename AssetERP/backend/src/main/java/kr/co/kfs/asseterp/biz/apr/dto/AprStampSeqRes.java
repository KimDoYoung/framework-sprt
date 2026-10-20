package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 인감대장 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_StampSeq 그리드 열, G06). title은 HTML(폐기 문서는 빨간 [폐기]) */
public record AprStampSeqRes(Long apprId, String stampSeqText, LocalDateTime apprDate, String regEmpName, String apprEmpName,
                             String title, String stampName, String receiveName, String putSealEmpName, LocalDateTime putSealDate) {
}
