package kr.co.kfs.asseterp.biz.batch.ipo;

import lombok.extern.slf4j.Slf4j;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** AS-IS BatchMain의 공모주 일정 문자열 해석(convMarketType·extrDate·extrLong)을 그대로 옮긴 것 */
@Slf4j
public final class IpoScheduleParser {

    private static final Pattern DATE_PATTERN = Pattern.compile("\\b\\d{4}\\.\\d{2}\\.\\d{2}\\b"); // yyyy.MM.dd

    private IpoScheduleParser() {
    }

    /** 시장구분 이름 → 코드(거래소 1·코스닥 2·코넥스 3·유가증권 4). 모르는 이름은 "" + 오류 로그 */
    public static String convMarketType(String marketType) {
        if ("거래소".equals(marketType)) {
            return "1";
        } else if ("코스닥".equals(marketType)) {
            return "2";
        } else if ("코넥스".equals(marketType)) {
            return "3";
        } else if ("유가증권".equals(marketType)) {
            return "4";
        }
        log.error("공모주일정 크롤링중 예외발생 - 미분류 시장구분 [{}]", marketType);
        return "";
    }

    /**
     * 문자열에서 yyyy.MM.dd 날짜를 앞에서부터 최대 2개 뽑는다. 비어 있으면 null(호출하는 쪽이 [0]을 바로 읽으면 AS-IS처럼 NPE),
     * 날짜가 하나뿐이면 [날짜, null], 3개 이상이면 AS-IS처럼 ArrayIndexOutOfBounds.
     * 날짜 해석은 AS-IS와 같은 SimpleDateFormat(느슨한 해석)을 쓴다.
     */
    public static LocalDate[] extrDate(String data) throws ParseException {
        if (data == null || data.length() == 0) {
            return null;
        }
        LocalDate[] dates = new LocalDate[2];
        Matcher m = DATE_PATTERN.matcher(data);
        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy.MM.dd");

        int i = 0;
        while (m.find()) {
            dates[i] = transFormat.parse(m.group()).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
            i++;
        }
        return dates;
    }

    /** 숫자 이외 문자를 모두 지우고 Long으로. 숫자가 없으면 null */
    public static Long extrLong(String data) {
        if (data == null) {
            return null;
        }
        String number = data.replaceAll("[^0-9]", "");
        if (!"".equals(number)) {
            return Long.parseLong(number);
        }
        return null;
    }
}
