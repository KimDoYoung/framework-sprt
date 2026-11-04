package kr.co.kfs.asseterp.biz.batch.service;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

/** AS-IS BatchMain이 stdDate 등을 읽던 방식 — 'yyyy-MM-dd'. 비어 있으면 기본값을 쓰고, 형식이 틀리면 AS-IS처럼 null이 된다 */
@Slf4j
public final class BatchDates {

    private BatchDates() {
    }

    public static boolean isBlank(String value) {
        return value == null || value.isEmpty();
    }

    /**
     * @return 파싱한 날짜, 형식이 틀리면 null (AS-IS는 ParseException을 출력만 하고 stdDate가 null인 채 이어간다 —
     *         원본-이상한점.md #에 기록. 그대로 옮겼다)
     */
    public static LocalDate parseOrNull(String value) {
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException e) {
            log.error("날짜 형식이 올바르지 않습니다(yyyy-MM-dd): {}", value, e);
            return null;
        }
    }
}
