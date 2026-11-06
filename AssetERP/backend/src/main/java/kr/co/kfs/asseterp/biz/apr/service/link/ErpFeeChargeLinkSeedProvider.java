package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.ErpFeeChargeLinkRow;
import kr.co.kfs.asseterp.biz.apr.dto.ErpFeeLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprExpenseLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A69 Asset-ERP 사용료청구 (Apr01_Edit_ApprDoc.insertLinkApprovals L3502-3540, 본문 ErpFeeChargeHtmlData.getHtmlContent).
 * refId = 호출 화면이 고른 첫 청구 행(AS-IS erpFeeChargeList.get(0) — 제목·시행일자(청구일자)·수신(계약사)·본문이 모두 이 행). 제목 `계약사 Asset ERP yyyy년 MM월 청구서`(고칠 수 있음).
 * 청구일자 기준 적용 사용료 설정(biz52_erp_fee.selectByStartDate)이 없으면 AS-IS처럼 본문을 채우지 않는다(문서분류의 대표 양식).
 * 호출 화면 `Biz55_Tab_ErpFeeCharge`(메뉴 1403)는 아직 TOBE에 없어 제공자만 있다(V20 Biz60과 같음).
 */
@Component
@RequiredArgsConstructor
public class ErpFeeChargeLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final DateTimeFormatter DOT = DateTimeFormatter.ofPattern("yyyy.MM.dd");
    private static final DateTimeFormatter TITLE_YM = DateTimeFormatter.ofPattern("yyyy년 MM월");

    private final AprExpenseLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A69");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        ErpFeeChargeLinkRow c = refId == null ? null : mapper.selectErpFeeCharge(refId);
        if (c == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "청구 정보를 찾을 수 없습니다.");
        }
        String title = c.corpName() + " Asset ERP " + c.startDate().format(TITLE_YM) + " 청구서";
        ErpFeeLinkRow fee = mapper.selectErpFeeByStartDate(user.getCompanyId(), c.erpContCorpId(), c.startDate());
        String content = fee == null ? null : content(c, fee);
        return new Seed(title, content, c.chargeDate(), false, false, c.corpName(), null);
    }

    // ───── ErpFeeChargeHtmlData ─────

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:20px; width:" + colspan + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdColorStrong(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + "<strong>" + text + "</strong>" + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + colspan + "%;\">"
                + "<span></span></td>";
    }

    private static String tdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:" + align + "; height:2px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    /** 이 클래스의 checkNull은 null·"null"이 " - ", "undefined"가 " " */
    private static String checkNull(String text) {
        if (text == null || "null".equals(text)) {
            return " - ";
        }
        return "undefined".equals(text) ? " " : text;
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : String.format(Locale.US, "%,d", num);
    }

    private static long nz(Long n) {
        return n == null ? 0L : n;
    }

    private static String tr(String... tds) {
        return "<tr>" + String.join("", tds) + "</tr>";
    }

    static String content(ErpFeeChargeLinkRow c, ErpFeeLinkRow fee) {
        long addSmsCount = nz(fee.smsBaseCount()) < nz(c.smsCount()) ? nz(c.smsCount()) - nz(fee.smsBaseCount()) : 0;
        long addServerUsage = nz(fee.serverBaseUsage()) < nz(c.serverUsage()) ? nz(c.serverUsage()) - nz(fee.serverBaseUsage()) : 0;
        long addUserCount = nz(fee.userBaseCount()) < nz(c.userCount()) ? nz(c.userCount()) - nz(fee.userBaseCount()) : 0;
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody>")
                .append(tr(tdStNone(100, 1, "left", 13, "다음과 같이 Asset ERP 사용료를 청구합니다.")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "center", 13, "- 다 음 -")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "1. 사용기간 : " + c.startDate().format(DOT) + " ~ " + c.closeDate().format(DOT))))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 청구금액")))
                .append(tr(tdStNone(100, 1, "right", 11, "(단위 : 원)")))
                .append(tr(tdStColor(21, 1, 1, "center", 13, "구분", "#EAEFF4"),
                        tdStColor(20, 1, 1, "center", 13, "금액", "#EAEFF4"),
                        tdStColor(59, 1, 1, "center", 13, "내역", "#EAEFF4")))
                .append(tr(tdColor(21, 1, 1, "center", 13, "시스템 사용료", "none"),
                        tdColor(20, 1, 1, "right", 13, checkLongNull(c.erpFee()), "none"),
                        tdColor(59, 1, 1, "left", 13, "", "none")))
                .append(tr(tdColor(21, 1, 1, "center", 13, "DATA 사용료", "none"),
                        tdColor(20, 1, 1, "right", 13, checkLongNull(c.dataFee()), "none"),
                        tdColor(59, 1, 1, "left", 13, " ", "none")))
                .append(tr(tdColor(21, 1, 1, "center", 13, "추가 문자 사용료", "none"),
                        tdColor(20, 1, 1, "right", 13, checkLongNull(c.addSmsFee()), "none"),
                        tdColor(59, 1, 1, "left", 13, "월 사용량 : " + checkLongNull(c.smsCount()) + "건 (추가사용 " + checkLongNull(addSmsCount) + "건)", "none")))
                .append(tr(tdColor(21, 1, 1, "center", 13, "추가 서버 사용료", "none"),
                        tdColor(20, 1, 1, "right", 13, checkLongNull(c.addServerFee()), "none"),
                        tdColor(59, 1, 1, "left", 13, "월 사용량 : " + checkLongNull(c.serverUsage()) + "GB (추가사용 " + addServerUsage + "GB)", "none")))
                .append(tr(tdColor(21, 1, 1, "center", 13, "추가 사용자 사용료", "none"),
                        tdColor(20, 1, 1, "right", 13, checkLongNull(c.addUserFee()), "none"),
                        tdColor(59, 1, 1, "left", 13, "총 사용자 : " + checkLongNull(c.userCount()) + "명 (추가사용 " + addUserCount + "명)", "none")))
                .append(tr(tdColor(21, 1, 1, "center", 13, "기타금액", "none"),
                        tdColor(20, 1, 1, "right", 13, checkLongNull(c.etcAmt()), "none"),
                        tdColor(59, 1, 1, "left", 13, checkNull(Html.esc(c.etcDesc())), "none")))
                .append(tr(tdColorStrong(21, 1, 1, "center", 13, "AssetERP사용료", "#E0E0E0"),
                        tdColorStrong(20, 1, 1, "right", 13, checkLongNull(c.totalAmt()), "#E0E0E0"),
                        tdColorStrong(59, 3, 1, "left", 13, "", "#E0E0E0")))
                .append(tr(tdColorStrong(21, 1, 1, "center", 13, "부가세", "#E0E0E0"),
                        tdColorStrong(20, 1, 1, "right", 13, checkLongNull(c.totalVat()), "#E0E0E0")))
                .append(tr(tdColorStrong(21, 1, 1, "center", 13, "청구금액", "#E0E0E0"),
                        tdColorStrong(20, 1, 1, "right", 13, checkLongNull(c.chargeAmt()), "#E0E0E0")));
        if (Boolean.TRUE.equals(c.addFeeServerYn())) {
            t.append(tr(tdStNone(100, 1, "left", 13, "* 서버 사용량 : 전월말 기준 서버 저장공간 " + checkLongNull(fee.serverBaseUsage()) + "GB를 초과하는 "
                    + checkLongNull(fee.serverAddUnit()) + "GB당 " + checkLongNull(fee.serverAddPrice()) + "원 추가")));
        }
        if (Boolean.TRUE.equals(c.addFeeSmsYn())) {
            t.append(tr(tdStNone(100, 1, "left", 13, "* 문자 사용량 : 월간 문자 사용량 " + checkLongNull(fee.smsBaseCount()) + "건을 초과하는"
                    + "1건당 " + checkLongNull(fee.smsAddPrice()) + "원 추가")));
        }
        if (Boolean.TRUE.equals(c.addFeeUserYn())) {
            t.append(tr(tdStNone(100, 1, "left", 13, "* " + checkNull(Html.esc(fee.userCountStdStr())) + " 기준 User " + checkLongNull(fee.userBaseCount()) + "명을 초과하는 경우 User "
                    + "1인당 월  " + checkLongNull(fee.userAddPrice()) + "원 추가징수")));
        }
        t.append(tr(tdStNone(100, 1, "left", 13, "* 한국펀드서비스 사무수탁시스템(ICAM)을 사용하는 조건으로 상기 사용료를 적용한다.")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "3. 입금기한 : " + checkNull(Html.esc(c.depositDueDay())))));
        return t.append("</tbody></table>").toString();
    }
}
