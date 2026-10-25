package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검항목·미흡내역 승인 처리 요청 — actionType A(승인)·R(반려)·C(취소). checkYm = 의견 글자수 검사의 기준일(그 달 1일) */
public record CheckApprStatusReq(String actionType, String checkYm, String apprCmnt) {
}
