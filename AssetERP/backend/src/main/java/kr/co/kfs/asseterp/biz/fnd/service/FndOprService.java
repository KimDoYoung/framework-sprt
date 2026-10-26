package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** AS-IS server/fnd/Fnd30_Opr.java — 수요예측(oprCode "02") 경로 (selectByDemandDate L44 / selectById L26 / modelUpdate L146 / multiUpdate L123 / delete L235 / deleteApprId L68 / deleteOprFund L87) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndOprService {

    /** 결재상태 AprStatusCode — 10:상신 20:결재중 30:결재완료 */
    private static final String STATUS_DONE = "30";
    private static final List<String> STATUS_PROGRESS = List.of("10", "20");

    private final FndOprMapper mapper;

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
