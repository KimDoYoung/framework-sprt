package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/** Scm10_Grid_Dev.update — 바뀐 줄(개발일·개발자·개발내용). devId 0 이하는 새 줄 */
public record DevSaveReq(Long devId, Long srId, Long personId, LocalDate regDate, String note) {
}
