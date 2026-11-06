package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateApprRes;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardApprRow;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoRelateApprRow;
import kr.co.kfs.asseterp.biz.biz.mapper.BizCardManagementMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A13 법인카드 내역관리 (Apr01_Edit_ApprDoc.insertLinkApprovals L3136-3175, 호출 Biz01_Tab_CardManagement.getPromoList·insertLinkApprovals).
 * args.dataYm = 기준년월(yyyy.MM), args.closeDate = 마감일(yyyy-MM-dd, 시행일자). 제목 `법인카드 사용내역서 (yyyy.MM)`은 고칠 수 있다.
 * 호출 화면이 하던 일 — 그 달 전체 내역 조회, 마감 안 된 내역 검사, 계정과목 이름별 합산(이름순) — 을 서버가 한다.
 * 본문은 {@link PromoHtml}. 연관문서 자동등록(Apr03_Page_Relate.insertBiz01RelateApprList)은 응답의 relateApprs로 돌려준다.
 */
@Component
@RequiredArgsConstructor
public class CardMgmtLinkSeedProvider implements AprLinkSeedProvider {

    private final BizCardManagementMapper mapper;
    private final BizRelateApprMapper relateMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A13");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년월 정보가 없습니다: dataYm");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String dataYm = args.get("dataYm");
        if (dataYm == null || dataYm.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년월 정보가 없습니다: dataYm");
        }
        List<BizCardApprRow> list = mapper.selectAllForAppr(user.getCompanyId(), dataYm.trim());
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "법인카드 내역이 없습니다.");
        }
        // insertLinkApprovals L670-676
        for (BizCardApprRow r : list) {
            if (!Boolean.TRUE.equals(r.closeYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "마감되지않은 법인카드내역이 포함되어있습니다");
            }
        }
        // L680-716: 계정과목 이름별로 합친다(이름순 — 자바 문자열 순서). 계정과목이 비어 있으면 원본은 NullPointerException
        TreeMap<String, Long> byAccount = new TreeMap<>(Comparator.naturalOrder());
        for (BizCardApprRow r : list) {
            if (r.accountName() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "계정과목이 연결되지 않은 법인카드내역이 포함되어있습니다");
            }
            byAccount.merge(r.accountName(), r.approvalAmount() == null ? Long.valueOf(0L) : r.approvalAmount(), Long::sum);
        }
        List<PromoHtml.AccountRow> accounts = new ArrayList<>();
        byAccount.forEach((name, sum) -> accounts.add(new PromoHtml.AccountRow(name, sum)));
        String content = PromoHtml.content(mapper.selectCardHtml(user.getCompanyId(), dataYm.trim()), accounts);

        LocalDate closeDate = null;
        String cd = args.get("closeDate");
        if (cd != null && !cd.isBlank()) {
            closeDate = LocalDate.parse(cd.trim());
        }
        // insertBiz01RelateApprList: 내역들이 이미 걸린 결재문서를 연관문서로
        List<Long> promoIds = list.stream().map(BizCardApprRow::promoId).toList();
        List<AprLinkRelateApprRes> relates = new ArrayList<>();
        for (BizPromoRelateApprRow a : relateMapper.selectByPromoIds(promoIds)) {
            relates.add(new AprLinkRelateApprRes(a.apprId(), a.regDate(), a.title(), a.inoutCode()));
        }
        return new Seed("법인카드 사용내역서 (" + dataYm.trim() + ")", content, closeDate, false, false).withRelateApprs(relates);
    }
}
