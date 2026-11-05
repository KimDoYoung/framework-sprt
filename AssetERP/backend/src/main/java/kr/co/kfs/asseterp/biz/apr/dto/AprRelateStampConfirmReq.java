package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** 날인본 확인/확인취소(AS-IS Apr19_RelateStamp.update) — check면 확인자=로그인 사원·확인일자=오늘, 아니면 둘 다 비운다 */
public record AprRelateStampConfirmReq(List<Long> ids, boolean check) {
}
