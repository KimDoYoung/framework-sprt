package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** A42 여비교통비 신청서 상신 뒤, 신청한 여비교통비들의 영수증 파일을 결재문서에 연결 (V36) */
public record TransportApprFilesReq(List<Long> ids, Long apprId) {
}
