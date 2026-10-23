package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/** AS-IS Ics40_DcrPreconfirm.updateByStatus — statusCode 20 승인 / 10 취소, items는 신청일 오름차순(AS-IS update()의 정렬) */
public record IcsDcrPreconfirmStatusReq(String statusCode, List<Item> items) {

    /** apprNo = 모델의 apprNo(심사필번호 앞부분) — 취소 때 과거 심사필번호 사용 검사에 쓴다 */
    public record Item(Long dcrPreconfirmId, String dcrTypeCode, String apprNo) {
    }
}
