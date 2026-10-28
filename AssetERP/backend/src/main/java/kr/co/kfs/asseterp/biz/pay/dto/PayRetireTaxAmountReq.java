package kr.co.kfs.asseterp.biz.pay.dto;

/** Pay13_RetireTax.insertRetireTax — menuNum 2·3·5·6·8·10 */
public record PayRetireTaxAmountReq(Long personId, Long monthId, int menuNum, Long itemAmt, Long pyItemAmt) {
}
