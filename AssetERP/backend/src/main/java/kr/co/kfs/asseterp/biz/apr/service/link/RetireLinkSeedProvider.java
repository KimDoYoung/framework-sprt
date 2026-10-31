package kr.co.kfs.asseterp.biz.apr.service.link;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemAmtRow;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLinkRow;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A05 퇴직정산서 (Apr01_Edit_ApprDoc.insertLinkApproval L1862-1911 · client/htmlData/RetireHtmlData.getHtmlContent L80-213).
 * 제목 읽기전용, [저장] 숨김, 시행일자 오늘(기본). refId = 퇴직정산 급여의 월 ID(pay10_month_id, 지급구분 03).
 * 본문 표는 원본 문자열 순서까지 그대로 만든다.
 */
@Component
@RequiredArgsConstructor
public class RetireLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_STYLE = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:%s;%s'>";
    private static final String TABLE_START = String.format(TABLE_STYLE, "100%", "");
    private static final String TABLE_START1 = String.format(TABLE_STYLE, "50%", " float:left");
    private static final String TABLE_START2 = String.format(TABLE_STYLE, "50%", " float:right");
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private final PayRetireMapper retireMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A05");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        PayRetireLinkRow m = refId == null ? null : retireMapper.selectRetireLink(user.getCompanyId(), refId);
        if (m == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "퇴직정산서 내역을 찾을 수 없습니다.");
        }
        String retire = m.retireDate() == null ? "" : m.retireDate(); // f_get_emptrans가 yyyy-MM-dd 글자로 준다
        String title = "퇴직정산서_(" + retire + ")_" + m.personName();
        List<PayItemAmtRow> list1 = retireMapper.selectRetireItems(m.personId(), m.payCd(), "1");
        List<PayItemAmtRow> list2 = retireMapper.selectRetireItems(m.personId(), m.payCd(), "2");
        return Seed.of(title, html(m, retire, list1, list2));
    }

    // ───── RetireHtmlData ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:10px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdNoneSlim(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }

    private static String checkNull(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return text;
    }

    private static String checkLongNull(Long num) {
        if (num == null) {
            return "- ";
        }
        return "&nbsp;" + NumberFormat.getIntegerInstance(Locale.US).format(num) + "&nbsp;";
    }

    private static String emptyRow20() {
        return TR_START + tdEmpty(1, 1, 0).repeat(20) + TR_CLOSE;
    }

    /** RetireHtmlData.getHtmlContent L80-213 — 문자열을 잇는 순서까지 원본 그대로(합계는 호출마다 0에서 시작) */
    static String html(PayRetireLinkRow model, String retireDate, List<PayItemAmtRow> list1, List<PayItemAmtRow> list2) {
        long paySum = 0L;
        long deductSum = 0L;
        StringBuilder text = new StringBuilder();
        text.append(TABLE_START).append(TBODY_START)
                .append(emptyRow20())
                .append(TR_START).append(tdNoneSlim(20, 1, "center", 22, "퇴 직 정 산 서")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START)
                .append(tdColor(5, 1, 1, "center", 14, "퇴직자", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "center", 14, checkNull(model.personName()), "none"))
                .append(tdColor(5, 1, 1, "center", 14, "퇴직일", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "center", 14, checkNull(retireDate), "none"))
                .append(TR_CLOSE)
                .append(TR_START)
                .append(tdColor(5, 1, 1, "center", 14, "소 속", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "center", 14, checkNull(model.orgName()), "none"))
                .append(tdColor(5, 1, 1, "center", 14, "직 위", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "center", 14, checkNull(model.posName()), "none"))
                .append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdColor(20, 1, 1, "center", 14, "세 부 내 역", "#EAEFF4")).append(TR_CLOSE)
                .append(TBODY_CLOSE).append(TABLE_CLOSE);

        text.append(TABLE_START1).append(TBODY_START)
                .append(TR_START).append(tdColor(4, 1, 1, "center", 14, "지급항목", "#EAEFF4")).append(tdColor(5, 1, 1, "center", 14, "금액", "#EAEFF4")).append(TR_CLOSE);
        for (PayItemAmtRow r : list1) {
            paySum += r.itemAmt();
            text.append(TR_START)
                    .append(tdColor(4, 1, 1, "center", 14, checkNull(r.itemName()), "#EAEFF4"))
                    .append(tdColor(5, 1, 1, "right", 14, checkLongNull(r.itemAmt()), "none"))
                    .append(TR_CLOSE);
        }
        text.append(TBODY_CLOSE).append(TABLE_CLOSE);

        // 원본은 오른쪽 표의 머리도 "지급항목"이다(공제 항목인데도) — 그대로
        text.append(TABLE_START2).append(TBODY_START)
                .append(TR_START).append(tdColor(4, 1, 1, "center", 14, "지급항목", "#EAEFF4")).append(tdColor(5, 1, 1, "center", 14, "금액", "#EAEFF4")).append(TR_CLOSE);
        for (PayItemAmtRow r : list2) {
            deductSum += r.itemAmt();
            text.append(TR_START)
                    .append(tdColor(4, 1, 1, "center", 14, checkNull(r.itemName()), "#EAEFF4"))
                    .append(tdColor(5, 1, 1, "right", 14, checkLongNull(r.itemAmt()), "none"))
                    .append(TR_CLOSE);
        }
        text.append(TBODY_CLOSE).append(TABLE_CLOSE);

        text.append(TABLE_START).append(TBODY_START)
                .append(emptyRow20())
                .append(TR_START)
                .append(tdColor(5, 1, 1, "center", 14, "지급금 계", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "right", 14, checkLongNull(paySum), "none"))
                .append(tdColor(5, 1, 1, "center", 14, "공제금 계", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "right", 14, checkLongNull(deductSum), "none"))
                .append(TR_CLOSE)
                .append(TR_START)
                .append(tdColor(10, 1, 1, "center", 14, "", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "center", 14, "차감지급액", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "right", 14, checkLongNull(paySum - deductSum), "none"))
                .append(TR_CLOSE)
                .append(TBODY_CLOSE).append(TABLE_CLOSE);
        return text.toString();
    }
}
