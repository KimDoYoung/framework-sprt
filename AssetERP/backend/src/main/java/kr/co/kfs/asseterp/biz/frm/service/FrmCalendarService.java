package kr.co.kfs.asseterp.biz.frm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.frm.dto.FrmCalendarEventRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmCalendarRes;
import kr.co.kfs.asseterp.biz.frm.mapper.FrmListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * MyPage 달력 (AS-IS servlet/JsonCalendar.java — JsonProvider mode=calendar, fullcalendar.jsp calEvent()가 부른다).
 * AS-IS와 다른 점: 테마 코드(LoginUser.getThemeCode())는 TOBE에 테마 설정이 없어(13-누락대장 "시스템 테마설정") 기본 "10"(파랑)으로 고정했다.
 * 테마 80의 무작위 색도 그래서 쓰지 않는다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FrmCalendarService {

    /** JsonCalendar L80-84: 테마 10 기본색 */
    private static final Color BASE_COLOR = new Color(38, 86, 147);
    private static final String TEXT_COLOR = "#FFFFFF";

    /** JsonCalendar L100-129: 업무구분 이름별 명도 배율 (없으면 1.0) */
    private static final Map<String, Float> TITLE_BRIGHTNESS = Map.ofEntries(
            Map.entry("계약만료", 2.2f), Map.entry("계약종료", 2.2f),
            Map.entry("공모주", 2.1f), Map.entry("공모주상장", 2.1f), Map.entry("공모주청약", 2.1f), Map.entry("배정공고일", 2.1f),
            Map.entry("수요예측", 2.1f), Map.entry("청약금환불", 2.1f), Map.entry("청약납입일", 2.1f),
            Map.entry("알림", 2.0f), Map.entry("임원만료", 1.9f), Map.entry("운용보고", 1.8f), Map.entry("내규정보", 1.8f),
            Map.entry("상신문서", 1.5f), Map.entry("예정거래", 1.6f), Map.entry("펀드관련", 1.5f), Map.entry("프로젝트", 1.5f),
            Map.entry("연차지정통보", 1.4f), Map.entry("연차사용촉진", 1.4f),
            Map.entry("월차사용촉진(1차)", 1.4f), Map.entry("월차사용촉진(2차)", 1.4f), Map.entry("월차지정통보(1차)", 1.4f), Map.entry("월차지정통보(2차)", 1.4f),
            Map.entry("스케줄", 1.3f), Map.entry("나의일정", 1.3f), Map.entry("부서일정", 1.3f),
            Map.entry("정기공시보고", 1.2f), Map.entry("자리비움", 1.1f), Map.entry("예약", 1.0f));

    private final FrmListMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** JsonCalendar 생성자 L32-55 + getJson L57-164. 기간은 달력이 보여 주는 달(fullcalendar getView intervalStart ~ intervalEnd-1) */
    public List<FrmCalendarEventRes> searchCalendar(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        Long orgCd = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectCalendar(user.getCompanyId(), user.getUserId(), orgCd, startDate, closeDate).stream()
                .map(r -> new FrmCalendarEventRes(r.date(), r.todoTitle(), r.title(),
                        colorToHex(adjustColor(BASE_COLOR, TITLE_BRIGHTNESS.getOrDefault(r.title(), 1.0f))), TEXT_COLOR))
                .toList();
    }

    /** adjustColor L166-171: HSB 명도만 배율(최대 1) */
    private static Color adjustColor(Color color, float factor) {
        float[] hsb = Color.RGBtoHSB(color.getRed(), color.getGreen(), color.getBlue(), null);
        hsb[2] = Math.min(1.0f, hsb[2] * factor);
        return new Color(Color.HSBtoRGB(hsb[0], hsb[1], hsb[2]));
    }

    /** colorToHex L173-175 */
    private static String colorToHex(Color c) {
        return String.format("#%02X%02X%02X", c.getRed(), c.getGreen(), c.getBlue());
    }
}
