package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandOfferRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.OprSubRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprSubSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOprFundMapper;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** AS-IS server/fnd/Fnd30_Opr.java — 수요예측(oprCode "02", Q05)과 공모주청약(oprCode "01", Q06) 경로 (selectByDemandDate L44 / selectById L26 / modelUpdate L146 / multiUpdate L123 / delete L235 / deleteApprId L68 / deleteOprFund L87) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndOprService {

    /** 결재상태 AprStatusCode — 10:상신 20:결재중 30:결재완료 */
    private static final String STATUS_DONE = "30";
    private static final List<String> STATUS_PROGRESS = List.of("10", "20");

    private final FndOprMapper mapper;
    private final FndOprFundMapper fundMapper;

    /** AS-IS selectByDemandDate: 검색어는 클라이언트가 "%…%"로 보낸다 */
    public List<OprDemandRes> searchDemand(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String oprCode, String searchText) {
        return mapper.selectByDemandDate(user.getCompanyId(), startDate, closeDate, oprCode, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectById — 상태 검사·등록창이 쓴다 */
    public OprDemandRes get(UserPrincipal user, Long oprId) {
        OprDemandRes opr = mapper.selectById(oprId, user.getCompanyId());
        if (opr == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return opr;
    }

    /** AS-IS modelUpdate(oprId null)·multiUpdate: 등록건수만큼 새 행을 만든다 → 새 ID 목록 */
    @Transactional
    public List<Long> create(UserPrincipal user, OprDemandSaveReq req) {
        OprDemandSaveReq normalized = normalize(req);
        int count = req.insertCount() == null || req.insertCount() < 1 ? 1 : req.insertCount();
        List<Long> ids = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            long oprId = mapper.selectNextId();
            mapper.insertDemand(oprId, user.getCompanyId(), normalized);
            ids.add(oprId);
        }
        return ids;
    }

    /** AS-IS modelUpdate(oprId 있음) → UPDATE */
    @Transactional
    public OprDemandRes update(UserPrincipal user, Long oprId, OprDemandSaveReq req) {
        if (mapper.updateDemand(oprId, user.getCompanyId(), normalize(req)) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(oprId, user.getCompanyId());
    }

    /**
     * AS-IS 화면 delete() L449: 상신 문서(관련 펀드·첨부 행·결재선·문서) → 펀드별 신청 → 수요예측 순으로 지운다(세 호출을 한 트랜잭션으로).
     * 결재완료·진행 중이면 못 지운다(화면 deleteCheck() L418-423 검사를 서버에서도)
     */
    @Transactional
    public void delete(UserPrincipal user, Long oprId) {
        OprDemandRes opr = get(user, oprId);
        checkNotInAppr(opr);
        if (opr.apprId() != null) {
            mapper.deleteRelateFund(opr.apprId());
            mapper.deleteFiles(opr.apprId());
            mapper.deleteApprSteps(opr.apprId());
            mapper.deleteAppr(opr.apprId());
        }
        mapper.deleteOprFunds(oprId);
        mapper.deleteOpr(oprId, user.getCompanyId());
    }

    // ───────────── 공모주청약 (Q06, oprCode "01") ─────────────

    /** AS-IS selectByDate: 검색어는 "%…%"로 */
    public List<OprSubRes> searchSubscription(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectBySubscriptionDate(user.getCompanyId(), startDate, closeDate, "01", "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectById (공모주청약) — 펀드별 배정 창의 발행가·수수료율·총배정수량 */
    public OprSubRes getSubscription(UserPrincipal user, Long oprId) {
        OprSubRes opr = mapper.selectSubscriptionById(oprId, user.getCompanyId());
        if (opr == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return opr;
    }

    /** AS-IS selectByDemandOprCode — [등록(수요예측)] 신청내역 조회창 */
    public List<OprDemandOfferRes> searchDemandOffers(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectDemandOffers(user.getCompanyId(), startDate, closeDate, "02", "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS modelUpdate(oprId null)·multiUpdate: 등록건수만큼 새 행을 만든다 → 새 ID 목록.
     * demandId가 있으면(AS-IS demandOprYn, 한 건만) 수요예측의 펀드별 신청수량 비율로 펀드별 배정도 함께 만든다
     */
    @Transactional
    public List<Long> createSubscription(UserPrincipal user, OprSubSaveReq req) {
        requireSubscription(req);
        int count = req.demandId() != null || req.insertCount() == null || req.insertCount() < 1 ? 1 : req.insertCount();
        List<Long> ids = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            long oprId = mapper.selectNextId();
            mapper.insertSubscription(oprId, user.getCompanyId(), req);
            ids.add(oprId);
            if (req.demandId() != null) {
                distributeFromDemand(user, oprId, req);
            }
        }
        return ids;
    }

    /** AS-IS modelUpdate(oprId 있음) → UPDATE */
    @Transactional
    public OprSubRes updateSubscription(UserPrincipal user, Long oprId, OprSubSaveReq req) {
        requireSubscription(req);
        if (mapper.updateSubscription(oprId, user.getCompanyId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectSubscriptionById(oprId, user.getCompanyId());
    }

    /**
     * AS-IS Fnd30_Opr.modelUpdate L169-221: 수요예측의 펀드별 신청수량 비율로 총배정수량을 나눠(소수점 버림) 펀드별 배정을 만들고,
     * 남은 수량은 배정수량이 큰 펀드부터 1씩 더한 뒤 배정금액·수수료·납입금액을 다시 계산한다(수수료 = 배정금액 × (수수료율×100 버림) / 10000).
     * 수요예측에 펀드별 신청이 없으면 AS-IS는 인덱스 오류로 실패하지만 여기서는 배정 없이 청약만 만든다
     */
    private void distributeFromDemand(UserPrincipal user, long oprId, OprSubSaveReq req) {
        OprDemandRes demand = mapper.selectById(req.demandId(), user.getCompanyId());
        if (demand == null || !"02".equals(demand.oprCode())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        Long demandSum = fundMapper.sumQty(req.demandId(), null);
        List<OprFundRes> demandFunds = fundMapper.selectByOprId(req.demandId());
        if (demandSum == null || demandSum == 0 || demandFunds.isEmpty()) {
            return;
        }
        long feeBase = BigDecimal.valueOf(req.feeRate()).multiply(BigDecimal.valueOf(100)).longValue();
        List<long[]> alloc = new ArrayList<>();  // {fundId, qty}
        long sumQty = 0;
        for (OprFundRes f : demandFunds) {
            long qty = (long) ((double) req.qty() / demandSum * (f.qty() == null ? 0 : f.qty()));
            sumQty += qty;
            alloc.add(new long[]{f.fundId(), qty});
        }
        if (req.qty() != sumQty) {
            alloc.sort(Comparator.comparingLong((long[] a) -> a[1]).reversed());
            long remain = req.qty() - sumQty;
            for (int i = 0; i < remain && i < alloc.size(); i++) {
                alloc.get(i)[1]++;
            }
        }
        for (long[] a : alloc) {
            long contAmt = a[1] * req.price();
            long fee = contAmt * feeBase / 10000;
            fundMapper.insertOprFund(fundMapper.selectNextId(), new OprFundSaveReq(null, oprId, a[0], null, req.price(), a[1], contAmt, fee, contAmt + fee));
        }
    }

    /** Fnd30_Edit_Opr.update L255-288의 필수 검사 — 화면이 먼저 막지만 서버도 같은 문구로 */
    private static void requireSubscription(OprSubSaveReq r) {
        if (r.subscriptionDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "청약일은 필수작성 항목입니다");
        if (r.payDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "납입일은 필수작성 항목입니다");
        if (r.itemName() == null || r.itemName().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "종목은 필수작성 항목입니다");
        if (r.corpId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "주간사는 필수선택 항목입니다");
        if (r.price() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "발행가는 필수작성 항목입니다");
        if (r.feeRate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "수수료율은 필수작성 항목입니다");
        if (r.qty() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "총배정수량은 필수작성 항목입니다");
    }

    /** 화면 CheckBox는 지우면 null이 아니라 false를 보낸다(AS-IS 에디터 flush) */
    private static OprDemandSaveReq normalize(OprDemandSaveReq r) {
        return new OprDemandSaveReq(r.demandDate(), r.itemName(), r.leadManager(), r.demandPeriod(), r.market(), r.priceBracket(),
                r.price(), Boolean.TRUE.equals(r.priceAcceptYn()), r.lockPeriod(), r.note(), Boolean.TRUE.equals(r.cancelYn()), r.insertCount(), r.payDate());
    }

    /** AS-IS apprCheck(Fnd31_Page L245-253)·deleteCheck(L418-423)의 상태 검사 */
    static void checkNotInAppr(OprDemandRes opr) {
        if (STATUS_DONE.equals(opr.apprStatusCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재완료된 문서가 존재합니다");
        }
        // List.of(...).contains(null)은 NPE — 결재문서가 없으면 상태가 null이다
        if (opr.apprStatusCode() != null && STATUS_PROGRESS.contains(opr.apprStatusCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재진행 중인 문서가 존재합니다");
        }
    }
}
