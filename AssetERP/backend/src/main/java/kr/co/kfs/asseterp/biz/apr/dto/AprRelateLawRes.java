package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 연관법규(apr20_relate_ics)·연관내규(apr22_relate_icr) 한 줄 (selectByApprId, V01) */
public record AprRelateLawRes(Long relateId, Long classTreeId, String classTreeFullName, String cycleName, LocalDate closeDate) {
}
