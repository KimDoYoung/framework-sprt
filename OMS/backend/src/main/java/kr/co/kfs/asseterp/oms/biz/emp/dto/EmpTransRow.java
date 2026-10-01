package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** emp03_trans INSERT/UPDATE 파라미터 (orgHeadYn: 'true'/'false') */
public record EmpTransRow(Long transId, Long personId, LocalDate transDate, String transCd, String kindCd, Long orgCodeId,
                          String titleCd, String posCd, String transReason, String orgHeadYn) {

    public static EmpTransRow of(Long transId, EmpTransSaveReq r) {
        return new EmpTransRow(transId, r.personId(), r.transDate(), r.transCd(), r.kindCd(), r.orgCodeId(),
                r.titleCd(), r.posCd(), r.transReason(), String.valueOf(r.orgHeadYn()));
    }
}
