package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 폐기문서 신청현황 한 행(Apr90_Tab_DisposalList). 폐기된 문서는 제목·상태를 apr99_appr_del에서 가져온다 */
public record AprDisposalListRes(Long disposalListId, Long apprId, LocalDateTime regDate, String title, String statusName,
                                 String reason, Boolean confirmYn, String confirmEmpName, LocalDateTime confirmDate) {
}
