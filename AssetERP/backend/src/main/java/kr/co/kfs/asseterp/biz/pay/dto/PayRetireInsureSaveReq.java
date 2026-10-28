package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** Pay12_RetireInsure.insertRetireInfo — 저장 대상 행(retireInsureId가 없으면 신규)과 삭제 id */
public record PayRetireInsureSaveReq(Long monthId, String insureCode, String year,
                                     List<PayRetireInsureRes> updates, List<Long> deleteIds) {
}
