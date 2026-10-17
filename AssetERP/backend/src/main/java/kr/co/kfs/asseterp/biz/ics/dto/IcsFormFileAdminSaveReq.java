package kr.co.kfs.asseterp.biz.ics.dto;

/** Ics01_Tab_IcsFileUpload 저장: 서버가 쓰는 값은 내용(note)뿐이다 (AS-IS update의 경로·크기 같은 값은 받지 않는다) */
public record IcsFormFileAdminSaveReq(Long fileId, String note) {
}
