package kr.co.kfs.asseterp.biz.crm.dto;

import java.time.LocalDate;

/** 업무활동내역 한 건 (AS-IS Crm12_WorkDetailModel 중 Crm12_Lookup_WorkDetail이 다루는 값). contactName = 거래처, shareInfo = 공유 요약("이름 외 n") */
public record CrmWorkDetailRes(Long workDetailId, Long contactId, String contactName, LocalDate workDate, LocalDate regDate,
                               String workName, String workContent, Boolean privateYn, Long personId, Long companyId, String shareInfo) {
}
