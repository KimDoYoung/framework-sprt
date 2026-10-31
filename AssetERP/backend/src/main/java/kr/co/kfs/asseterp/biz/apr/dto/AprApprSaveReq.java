package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 전자결재 [저장]·[결재요청] (AS-IS client/vi/apr/Apr01_Edit_ApprDoc.save / updateChk → apr.Apr01_Appr.update, V03).
 * mode: "save"(임시저장, 상태 99) | "request"(결재요청, 상태 10 또는 30). 상태·등록자·회사는 서버가 정한다(AS-IS는 클라이언트 값을 믿었다).
 * classTreeId·linkCode는 새 문서일 때만 쓴다. message는 상신자 결재의견(결재요청의 상신 단계 비고, Apr01_Edit_NoteMessage).
 * confirmed는 "결재선에 상신자 외 결재권자가 없습니다. 계속 진행하시겠습니까?"에 [예]라고 답한 뒤 다시 보낼 때 true.
 */
public record AprApprSaveReq(String mode, Long classTreeId, String linkCode, String title, String content, String note,
                             LocalDateTime effectDate, LocalDateTime regDate, Long stampId, String receiveName, String referenceName,
                             String inOutTypeCode, String signCompany, String signCeo, String stampPosition, String formType,
                             String message, boolean confirmed, List<AprApprSaveStepReq> steps) {
}
