package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/**
 * 항목 저장(Pay11_TabPage_MonthItem [저장]) — itemType "1"(지급)은 저장 뒤 소득세·지방세를 다시 계산하고,
 * "2"(공제)는 221·231·241(4대보험 연말정산) 행마다 검증한다. 지급일·사원은 서버가 monthId로 정한다
 */
public record PayMonthItemSaveReq(Long monthId, String itemType, List<Row> updateList, List<Long> deleteIds) {

    /** 저장할 행. monthItemId가 없으면 새 행 */
    public record Row(Long monthItemId, String itemCd, Long itemAmt) {
    }
}
