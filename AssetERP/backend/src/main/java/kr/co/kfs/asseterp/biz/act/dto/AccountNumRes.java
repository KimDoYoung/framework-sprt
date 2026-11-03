package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 결산회기관리 한 행 (act09_account_num.selectByRetrieve·selectById, EE10) */
public record AccountNumRes(
        Long accountNumId,
        Long num,
        LocalDate startDate,
        LocalDate closeDate,
        String note
) {
}
