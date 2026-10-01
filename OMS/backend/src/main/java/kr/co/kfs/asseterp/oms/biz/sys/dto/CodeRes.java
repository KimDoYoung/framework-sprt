package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/**
 * 공통코드 (AS-IS Sys09_CodeModel, sys09_code)
 *
 * @param closeYn  미사용 (sys09_close_yn = 'true')
 * @param lastDate 같은 코드의 다음 시작일 하루 전 (이력 코드의 실제 종료일)
 */
public record CodeRes(
        Long codeId,
        Long companyId,
        Long codeKindId,
        String code,
        String name,
        String seq,
        boolean closeYn,
        LocalDate applyDate,
        LocalDate closeDate,
        LocalDate lastDate,
        String note
) {
}
