package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 폐기문서 승인 그리드 한 행 (F10, AS-IS Apr90_DisposalListModel 중 Apr90_Tab_DisposalAppr가 쓰는 열) */
public record AprDisposalApprRes(Long disposalListId, Long apprId, String disposalCode, String disposalName, LocalDateTime regDate,
                                 String regEmpName, String title, String statusName, String reason, Boolean confirmYn,
                                 String confirmEmpName, LocalDateTime confirmDate) {
}
