package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** [지급확인]·[지급취소] (AS-IS Emp17_Benefit.update — 지급여부만 바뀐다) */
public record BenefitYnReq(List<Long> benefitIds, boolean benefitYn) {
}
