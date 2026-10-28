package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** Pay14_RetireTaxItem.insertRetireTaxItem — menuNum은 1(총소득액)·4(종합소득공제)·7(세액공제) */
public record PayRetireTaxItemSaveReq(Long personId, Long monthId, int menuNum,
                                      List<PayRetireTaxItemRes> updates, List<Long> deleteIds) {
}
