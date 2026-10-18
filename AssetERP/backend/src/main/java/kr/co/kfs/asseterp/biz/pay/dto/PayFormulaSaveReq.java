package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 임금계산방법 저장 한 행 — formulaId가 0 이하이거나 DB에 없으면 등록(적용일·항목코드를 같이 보낸다) */
public record PayFormulaSaveReq(Long formulaId, LocalDate startDate, String itemCd, String formulaForm, String note) {
}
