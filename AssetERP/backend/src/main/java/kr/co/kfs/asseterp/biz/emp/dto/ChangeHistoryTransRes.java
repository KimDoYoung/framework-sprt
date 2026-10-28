package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDateTime;

/** 사원정보 변경조회 > 일반발령 탭 행 (AS-IS Emp03_TransModel, emp03_trans.selectByHistory) */
public record ChangeHistoryTransRes(
        LocalDateTime transDate,
        String empKorName,
        String transName,
        String kindName,
        String orgName,
        String titleName,
        String posName,
        String gradeName,
        String duty,
        LocalDateTime expiryDate,
        String orgHeadYn,
        String officerYn,
        String tdmTargetYn,
        String nonStayYn,
        String transReason
) {
}
