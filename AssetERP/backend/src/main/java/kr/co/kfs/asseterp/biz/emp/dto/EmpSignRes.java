package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS Emp60_SignModel — 결재서명 한 행 (G09). 논리 값은 'true'/'false' 문자열, signIdString은 서명 이미지(sys10_file 부모 ID) 칸용 */
public record EmpSignRes(Long signId, String signIdString, Long signFileId, String useYn, String note) {
}
