package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateFundRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprOprLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprSubRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOprFundMapper;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A26 공모주청약 운용지시(Apr01_Edit_ApprDoc L2069-2099) · A38 공모주 수요예측(L2676-2701). refId = 운용지시 ID(fnd30_opr_id).
 * 제목은 고칠 수 있고, 시행일자는 A26 = 청약일, A38 = 수요예측일(신청일). 본문은 {@link OprHtml}.
 * 저장 직후 원본이 하던 연관펀드 자동등록(fnd31_opr_fund.selectByDistinctOprId → fnd00_fund.selectById, 없으면 adv02_account.selectById)은
 * 응답의 relateFunds·relateAdvs로 돌려 결재창이 연관 탭에 넣게 한다(저장은 연관 탭의 [저장]·[결재요청] 때).
 */
@Component
@RequiredArgsConstructor
public class OprLinkSeedProvider implements AprLinkSeedProvider {

    private final FndOprMapper oprMapper;
    private final FndOprFundMapper oprFundMapper;
    private final AprOprLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A26", "A38");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        if (refId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "운용지시 정보가 없습니다.");
        }
        List<OprFundRes> funds = oprFundMapper.selectByOprId(refId);
        Seed seed;
        if ("A26".equals(linkCode)) {
            OprSubRes m = oprMapper.selectSubscriptionById(refId, user.getCompanyId());
            if (m == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "공모주 청약 정보를 찾을 수 없습니다.");
            }
            seed = new Seed("[" + m.itemName() + "] " + "공모주 청약 및 납입 운용지시의 건", OprHtml.subscription(funds, m), m.subscriptionDate(), false, false);
        } else {
            OprDemandRes m = oprMapper.selectById(refId, user.getCompanyId());
            if (m == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "공모주 수요예측 정보를 찾을 수 없습니다.");
            }
            seed = new Seed(m.itemName() + " 공모주 수요예측 참여의 건", OprHtml.demand(funds, m), m.demandDate(), false, false);
        }
        List<AprLinkRelateFundRes> relateFunds = new ArrayList<>();
        List<AprLinkRelateAdvRes> relateAdvs = new ArrayList<>();
        for (Long fundId : mapper.selectDistinctFundIds(refId)) {
            AprLinkRelateFundRes f = mapper.selectFund(user.getCompanyId(), fundId);
            if (f != null) {
                relateFunds.add(f);
            } else {
                AprLinkRelateAdvRes a = mapper.selectAdv(user.getCompanyId(), fundId);
                if (a != null) {
                    relateAdvs.add(a);
                }
            }
        }
        return seed.withRelateFunds(relateFunds, relateAdvs);
    }
}
