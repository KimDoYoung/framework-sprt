package kr.co.kfs.asseterp.biz.emp.dto;

/** 특정직위 및 알림설정 행 (AS-IS Emp03_Lookup_Grade → emp.Emp03_Trans.selectByGrade, 그리드 열만) */
public record TransGradeRes(
        Long transId,
        Long personId,
        String orgFullName,
        String titleName,
        String empNo,
        String empKorName,
        String gradeCode,
        String gradeName,
        /* emp25_mypage_notice 'true'/'false' → 불리언 (행이 없으면 null) */
        Boolean icsYn,
        Boolean apprYn
) {
}
