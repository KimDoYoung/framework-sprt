package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeApprRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFeeChargeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A18·A19 최저보수 청구(운용사 / 운용사 외), A20 최저보수 청구(통합본) — Apr01_Edit_ApprDoc.insertLinkApproval L2002-2034,
 * 본문 client/htmlData/FeeChargeHtmlData.getHtmlContent3 (호출 화면 Biz20_Tab_FeeCharge, EE21).
 * <ul>
 * <li>A18·A19: refId = 청구보수ID(realFeeChargeId). 제목 `운용사 + " 사무관리보수 발생내역 및 비용청구의 건"`(편집 가능), 수신처 = 운용사, 본문 = 청구 안내문(입금계좌 포함).</li>
 * <li>A20: 제목·본문 없음(제목 편집 가능, 본문은 문서분류 대표 양식), 등록·시행일자는 오늘. AS-IS 는 저장 직후 통합 엑셀(createTotalFeeExcel)을 첨부하는데 그것은 다음 단계다.</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
public class FeeChargeLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final String NBSP = "&nbsp;".repeat(18);
    private static final DateTimeFormatter DOT_DATE = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    private final BizFeeChargeMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A18", "A19", "A20");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        if ("A20".equals(linkCode)) {
            return new Seed(null, null, null, false, false);
        }
        List<BizFeeChargeApprRes> list = refId == null ? List.of() : mapper.selectHtmlContent(user.getCompanyId(), refId);
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "보수입금계좌를 입력해주세요.");
        }
        BizFeeChargeApprRes m = list.get(0);
        return new Seed(m.corpNm() + " 사무관리보수 발생내역 및 비용청구의 건", content(list, m), null, false, false, m.corpNm(), null);
    }

    private static String content(List<BizFeeChargeApprRes> list, BizFeeChargeApprRes model) {
        DecimalFormat nf = new DecimalFormat("###,###,###");
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody>");
        t.append("<tr>").append(none(20, "left", 14, NBSP + "1. 귀사의 무궁한 발전을 기원합니다.")).append("</tr>");
        for (BizFeeChargeApprRes r : list) {
            t.append("<tr>").append(none(20, "left", 14, NBSP + "2. 양사간 체결한 '일반사무관리 업무위탁계약'에 의거 사무관리보수 청구 내역을 아래와 같이 안내드리오니 업무에 협조하여 주시기 바랍니다.")).append("</tr>")
                    .append("<tr>").append(empty(20)).append("</tr>")
                    .append("<tr>").append(empty(20)).append("</tr>")
                    .append("<tr>").append(empty(5)).append(none(10, "center", 14, "-  아   래  -")).append(empty(5)).append("</tr>")
                    .append("<tr>").append(empty(20)).append("</tr>")
                    .append("<tr>").append(empty(2)).append(none(18, "left", 14, "1. 청구 대상자산 및 기간")).append("</tr>")
                    .append("<tr>").append(empty(3)).append(none(17, "left", 14, "가. 대상 자산 : " + Html.esc(r.corpNm()) + " 펀드")).append("</tr>")
                    .append("<tr>").append(empty(3)).append(none(17, "left", 14, "나. 대상 기간 : " + DOT_DATE.format(r.occStartDate()) + " ~ " + DOT_DATE.format(r.occCloseDate()))).append("</tr>")
                    .append("<tr>").append(empty(3)).append(none(17, "left", 13, "※ 보수율은 계약서의 상품유형별 보수율표 참조")).append("</tr>");
        }
        t.append("<tr>").append(empty(2)).append(none(18, "left", 14, "2. 청구금액 : " + num(nf, model.realChargeFee()))).append("</tr>")
                .append("<tr>").append(empty(3)).append(none(17, "left", 14, "가. 기본 보수 : " + num(nf, model.occFee()))).append("</tr>")
                .append("<tr>").append(empty(3)).append(none(17, "left", 14, "나. 최저 보수 : " + num(nf, model.minFee()))).append("</tr>")
                .append("<tr>").append(empty(3)).append(none(17, "left", 14, "※ 청구금액 = 최저보수(총 보수 금액) - 기본보수(펀드발생보수)")).append("</tr>");
        for (BizFeeChargeApprRes r : list) {
            t.append("<tr>").append(empty(2)).append(none(18, "left", 14, "3. 입금계좌 : " + Html.esc(r.bankNm()) + " " + Html.esc(r.accountNo()) + " (" + Html.esc(r.accountNm()) + ")")).append("</tr>");
        }
        t.append("<tr>").append(empty(2)).append(none(18, "left", 14, "4. 입금기한 : 청구일로부터 10일 이내. 끝.")).append("</tr>");
        return t.append("</tbody></table>").toString();
    }

    /** AS-IS numberFormat.format(Long) — null 이면 NPE 나던 자리라 "0" */
    private static String num(DecimalFormat nf, Long v) {
        return nf.format(v == null ? 0L : v);
    }

    /** AS-IS tdStNone — 닫는 태그에 `</strong>` 이 섞인 것까지 그대로 */
    private static String none(int colspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border-style:none; border-width:2px; text-align:" + align
                + "; height:25px; width:" + (colspan * 5) + "%;\"><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    /** AS-IS tdEmpty(colspan, 1, 0) */
    private static String empty(int colspan) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:0px; height:15px; width:" + (colspan * 5) + "%;\"><span></span></td>";
    }
}
