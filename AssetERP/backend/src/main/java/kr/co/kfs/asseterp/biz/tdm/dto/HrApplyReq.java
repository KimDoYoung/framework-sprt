package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 인사정보 적용 요청 한 건 — AS-IS는 변동 목록 행을 그대로 보내고 서버가 쓰는 값은 아래 네 개뿐이다 */
public record HrApplyReq(
        Long personId,
        String changeTypeCode,
        LocalDate befEndDate,
        LocalDate aftEndDate
) {
}
