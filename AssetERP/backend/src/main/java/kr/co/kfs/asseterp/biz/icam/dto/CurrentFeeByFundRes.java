package kr.co.kfs.asseterp.biz.icam.dto;

/**
 * [1268/1494] 펀드별 발생보수현황 조회 응답 (R06)
 * AS-IS: myApp/client/vi/icam/model/Icam10_FeeModel.java
 */
public record CurrentFeeByFundRes(
        Long feeId,
        String fundName,
        Double beforefee1,
        Double afterfee1,
        Double beforefee2,
        Double afterfee2,
        Double beforefee3,
        Double afterfee3,
        Double beforefee4,
        Double afterfee4,
        Double beforefee5,
        Double afterfee5,
        Double beforefee6,
        Double afterfee6,
        Double beforefee7,
        Double afterfee7,
        Double beforefee8,
        Double afterfee8,
        Double beforefee9,
        Double afterfee9,
        Double beforefee10,
        Double afterfee10,
        Double beforefee11,
        Double afterfee11,
        Double beforefee12,
        Double afterfee12,
        Double totalBeforefee,
        Double totalAfterfee
) {
}
