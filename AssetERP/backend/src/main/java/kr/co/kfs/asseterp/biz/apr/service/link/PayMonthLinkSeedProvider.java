package kr.co.kfs.asseterp.biz.apr.service.link;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemAmtRow;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthSumRow;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateApprBase;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRelateApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A02 급여대장 (Apr01_Edit_ApprDoc.insertLinkApproval L204-266 · client/htmlData/PayMonthSumHtmlData.getHtml10Content L316-445, V25).
 * 제목 `급여대장 (지급일 / 구분명)`, 제목 읽기전용·[저장] 숨김·시행일자 오늘은 기본값. refId = 급여대장 상신 행 ID(pay05_relate_appr_id).
 * 본문 표는 원본 문자열 순서까지 그대로 만든다(공제 머리 행의 닫히지 않은 `<tr>`도 원본 그대로).
 */
@Component
@RequiredArgsConstructor
public class PayMonthLinkSeedProvider implements AprLinkSeedProvider {

    private static final String HEIGHT = "25";
    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private final PayRelateApprMapper relateApprMapper;
    private final PayMonthMapper monthMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A02");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        PayRelateApprBase base = refId == null ? null : relateApprMapper.selectBase(user.getCompanyId(), refId);
        if (base == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "급여대장 상신 내역을 찾을 수 없습니다.");
        }
        Long companyId = user.getCompanyId();
        LocalDate payDate = base.startDate();
        String payCode = base.payCode();
        // AS-IS 요청 순서: getHtmlData10(공제 '2') → selectBypayCode → getHtmlData10(지급 '1')
        List<PayItemAmtRow> deduction = monthMapper.selectItemSums(companyId, payCode, payDate, "2");
        List<PayMonthSumRow> sums = monthMapper.selectSums(companyId, payCode, payDate);
        List<PayItemAmtRow> pay = monthMapper.selectItemSums(companyId, payCode, payDate, "1");
        return Seed.of("급여대장 (" + base.payGroupName() + ")", html(deduction, sums, pay));
    }

    // ───── PayMonthSumHtmlData ─────

    private static String tdCreate(int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdCreate(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

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

    /** `###,###,###,###` */
    private static String checkLongNull(Long num) {
        if (num == null) {
            return "- ";
        }
        return "&nbsp;" + NumberFormat.getIntegerInstance(Locale.US).format(num) + "&nbsp;";
    }

    private static long n(Long v) {
        return v == null ? 0L : v;
    }

    /** PayMonthSumHtmlData.getHtml10Content L316-445 — 합계는 호출마다 0에서 시작(AS-IS는 clear10()로 비움) */
    static String html(List<PayItemAmtRow> monthList, List<PayMonthSumRow> monthList2, List<PayItemAmtRow> monthList3) {
        long paySum = 0L;
        long taxDdcSum = 0L;
        long realPay = 0L;
        for (PayMonthSumRow m : monthList2) {
            paySum += n(m.paySum());
            taxDdcSum += n(m.taxDdcSum());
            realPay += n(m.deductionSum());
        }
        StringBuilder text = new StringBuilder();
        text.append(TABLE_START).append(TBODY_START)
                .append(TR_START).append(tdEmpty(1, 1, 0).repeat(20)).append(TR_CLOSE)
                .append(TR_START).append(tdNoneSlim(20, 1, "center", 22, "급 여 내 역")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 14, "&nbsp;계정과목 : 임직원 급여")).append(TR_CLOSE)
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 14, "&nbsp;임 금 : - 원 ( ₩" + checkLongNull(paySum) + ")")).append(TR_CLOSE)
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 14, "&nbsp;내 역 : 임직원 급여")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(2, 1, 0)).append(tdCreate(15, 1, 1, "center", 14, "지 급", "#EAEFF4")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(2, 1, 0))
                .append(tdCreate(5, 1, 1, "center", 14, "지 급 내 역", "#EAEFF4"))
                .append(tdCreate(5, 1, 1, "center", 14, "금 액", "#EAEFF4"))
                .append(tdCreate(5, 1, 1, "center", 14, "비 고", "#EAEFF4"))
                .append(TR_CLOSE);
        for (PayItemAmtRow m : monthList3) {
            text.append(TR_START).append(tdEmpty(2, 1, 0))
                    .append(tdColor(5, 1, 1, "center", 14, checkNull(m.itemName()), "none"))
                    .append(tdColor(5, 1, 1, "right", 14, checkLongNull(m.itemAmt()), "none"))
                    .append(tdColor(5, 1, 1, "left", 14, checkNull(" "), "none"))
                    .append(TR_CLOSE);
        }
        text.append(TR_START).append(tdEmpty(2, 1, 0))
                .append(tdCreate(5, 1, 1, "center", 14, "지급액 합계", "#F2F2F2"))
                .append(tdCreate(5, 1, 1, "right", 14, checkLongNull(paySum), "#F2F2F2"))
                .append(tdCreate(5, 1, 1, "left", 14, " ", "#F2F2F2"))
                .append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                // 원본: "공 제" 행을 닫지 않고 다음 <tr>을 연다(그대로)
                .append(TR_START).append(tdEmpty(2, 1, 0)).append(tdCreate(15, 1, 1, "center", 14, "공 제", "#EAEFF4"))
                .append(TR_START).append(tdEmpty(2, 1, 0))
                .append(tdCreate(5, 1, 1, "center", 14, "공 제 내 역", "#EAEFF4"))
                .append(tdCreate(5, 1, 1, "center", 14, "금 액", "#EAEFF4"))
                .append(tdCreate(5, 1, 1, "center", 14, "비 고", "#EAEFF4"))
                .append(TR_CLOSE);
        for (PayItemAmtRow m : monthList) {
            text.append(TR_START).append(tdEmpty(2, 1, 0))
                    .append(tdColor(5, 1, 1, "center", 14, checkNull(m.itemName()), "none"))
                    .append(tdColor(5, 1, 1, "right", 14, checkLongNull(m.itemAmt()), "none"))
                    .append(tdColor(5, 1, 1, "left", 14, checkNull(" "), "none"))
                    .append(TR_CLOSE);
        }
        text.append(TR_START).append(tdEmpty(2, 1, 0))
                .append(tdCreate(5, 1, 1, "center", 14, "공제액 합계", "#F2F2F2"))
                .append(tdCreate(5, 1, 1, "right", 14, checkLongNull(taxDdcSum), "#F2F2F2"))
                .append(tdCreate(5, 1, 1, "left", 14, " ", "#F2F2F2"))
                .append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(2, 1, 0))
                .append(tdCreate(5, 1, 1, "center", 14, "차감지급액", "#F2F2F2"))
                .append(tdCreate(5, 1, 1, "right", 14, checkLongNull(realPay), "#F2F2F2"))
                .append(tdCreate(5, 1, 1, "left", 14, " ", "#F2F2F2"))
                .append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 14, "&nbsp;비 고 : ")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TBODY_CLOSE).append(TABLE_CLOSE);
        return text.toString();
    }
}
