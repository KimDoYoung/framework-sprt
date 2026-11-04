package kr.co.kfs.asseterp.biz.pln.dto;

import java.time.LocalDate;

/**
 * 리서치 일정 한 건 (AS-IS Pln03_ResrchModel 중 Pln03_Lookup_ResrchDetail이 다루는 값).
 * regEmpName·cfrmEmpName = "이름 (부서)", targetTypeName = 조사대상구분명, issuingEntityName = 조사대상(종목이면 발행기관, 업종이면 코드명)
 */
public record PlnResrchRes(Long resrchId, Long classTreeId, String classTreeName, Long issuingEntityId, String issuingEntityName,
                           String visitReason, Long regPersonId, String regEmpName, LocalDate regDate, LocalDate closeDate, String closeYn,
                           LocalDate resrchStartDate, LocalDate resrchCloseDate, Long cfrmPersonId, String cfrmEmpName, LocalDate cfrmDate,
                           String note, String targetTypeCode, String targetTypeName) {
}
