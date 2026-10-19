package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 인사평가 항목리스트 기준 적용일 한 행 (AS-IS emp40_eval_list_std.selectByCompanyId). 확정은 DB 형태('true'/'false') 그대로 */
public record EvalListStdRes(Long evalListStdId, Long companyId, LocalDate startDate, String fixYn) {
}
