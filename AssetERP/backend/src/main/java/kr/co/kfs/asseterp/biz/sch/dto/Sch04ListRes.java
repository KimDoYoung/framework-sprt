package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * 법규보고 점검 한 행 (AS-IS Sch04_ListModel, sch04_list.selectByIcs / selectById).
 * listId는 sch04_list에 저장된 행이면 실제 ID, 아직 처리하지 않은 건(noneDataYn)이면 UNION이 만든 임시 번호(2000000·3000000·6000000·7000000 + 순번)다.
 * selectById는 issDate·relatedLaw·apprTitle·issApprId·advisYn을 돌려주지 않는다(AS-IS와 같음) — null.
 */
public record Sch04ListRes(Long listId, Long companyId, LocalDate closeDate, Long mngOrgId, String mngOrgName, Long managerId, String managerName,
                           Long personId, String personName, String statusCode, String statusName, LocalDate manageDate, Boolean confirmYn,
                           String title, Long icsClassTreeId, String relatedLaw, String apprTitle, Long issApprId, LocalDate issDate,
                           String scheduleCode, String scheduleName, String cycleCode, String cycleName, Boolean advisYn, Long infoId,
                           Long deadlineId, String note, LocalDate confirmDate, Long confirmerId, String confirmerName, Boolean noneDataYn) {
}
