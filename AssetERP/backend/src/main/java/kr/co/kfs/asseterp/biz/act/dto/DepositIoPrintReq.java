package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotNull;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;

import java.util.List;

/** 일일자금관리 출력/다운로드·상신 (AS-IS sys.Sys99_Print.insertRdDepositIoList) — 그리드에 보이는 예금원장 행을 그대로 보낸다 */
public record DepositIoPrintReq(@NotNull List<BookRes> rows) {
}
