package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 급여 생성(Pay10_Lookup_Insert → Emp01_Lookup_TransDate 확인) — AS-IS Pay10_Month.insert 파라미터
 * annualYn: 연봉정보로 만들면 true, 전월 급여 복사면 false. stdMonth: 급여지급기준월 yyyy.MM(빈칸 가능)
 */
public record PayMonthCreateReq(String payCode, LocalDate payDate, boolean annualYn, String stdMonth, List<Target> targets) {

    /** 생성 대상 사원 한 명 — Emp03_TransModel의 transCode·personId·hireDate·transDate */
    public record Target(Long personId, String transCode, LocalDate hireDate, LocalDate transDate) {
    }
}
