package kr.co.kfs.asseterp.biz.crd.dto;

import java.util.List;

/**
 * 선택 내역 대상 — ids가 있으면 그 내역(선택내역확정·삭제), ids가 없으면 조회조건(전체내역확정: AS-IS가 selectByText로 조건에 맞는 전체를 읽는다).
 * confirm은 ALL(전체) / DONE(확정) / NOT_ALL(미확정(승인취소포함)) / NOT_EXCEPT_CANCEL(미확정(승인취소제외))
 */
public record CrdDataTargetReq(
        List<Long> ids,
        String searchText,
        String dataBankCode,
        String dataYm,
        String confirm
) {
}
