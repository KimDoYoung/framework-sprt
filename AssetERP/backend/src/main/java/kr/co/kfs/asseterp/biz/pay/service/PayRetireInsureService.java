package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireInsureRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireInsureSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/** 퇴직정산 4대보험 탭 Pay12_TabPage_RetireInsure (S22) — AS-IS pay.Pay12_RetireInsure · sys.Sys99_Print.insertRdRetireInsure */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRetireInsureService {

    private static final String RD_WINDOW_CLASS_NAME = "Pay12_TabPage_RetireInsure";
    /** 4대보험 구분 → 퇴직정산 급여 항목 코드(건강보험 222 · 장기요양 232 · 고용보험 242) */
    private static final Map<String, String> ITEM_CODES = Map.of("2", "222", "3", "232", "4", "242");

    private final PayRetireMapper mapper;

    /** pay.Pay12_RetireInsure.selectByPersonId */
    public List<PayRetireInsureRes> search(UserPrincipal user, Long personId, String insureCode) {
        requirePerson(user, personId);
        return mapper.selectInsures(personId, insureCode);
    }

    /**
     * pay.Pay12_RetireInsure.insertRetireInfo — 행 저장(없으면 새 ID)·삭제 뒤, 그 보험·연도의 정산보험료 합계를 급여 항목에 넣는다.
     * 저장·삭제 대상은 요청의 급여(monthId)에 속한 행만(TOBE 추가)
     */
    @Transactional
    public void save(UserPrincipal user, PayRetireInsureSaveReq req) {
        if (req.monthId() == null || req.insureCode() == null || mapper.countMonth(user.getCompanyId(), req.monthId(), null) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        for (PayRetireInsureRes row : nz(req.updates())) {
            if (row.monthId() != null && !row.monthId().equals(req.monthId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            mapper.upsertInsure(new PayRetireInsureRes(row.retireInsureId(), req.monthId(), req.insureCode(), row.year(), row.applyTerm(),
                    row.workMonthCnt(), row.payMonthCnt(), row.totalPay(), row.monthPay(), row.insureRate(),
                    row.monthAmt(), row.fixAmt(), row.payAmt(), row.unpayAmt(), row.settleAmt()));
        }
        for (Long id : nz(req.deleteIds())) {
            mapper.deleteInsure(req.monthId(), id);
        }
        long itemAmt = 0L;
        for (PayRetireInsureRes row : mapper.selectInsuresByYear(req.monthId(), req.insureCode(), req.year())) {
            itemAmt += row.settleAmt() == null ? 0L : row.settleAmt();
        }
        String itemCode = ITEM_CODES.get(req.insureCode());
        if (itemCode != null) {
            mapper.updateMonthItemAmt(req.monthId(), itemCode, itemAmt);
        }
    }

    /** pay.Pay12_RetireInsure.callInsureRetire — [4대보험 정산 재생성] (checkYn 없음, gubun P) */
    @Transactional
    public void regenerate(UserPrincipal user, Long personId) {
        requirePerson(user, personId);
        String msg = mapper.callInsureRetire(personId, null, "P");
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        }
    }

    /** sys.Sys99_Print.insertRdRetireInsure — 내 출력 자료를 지우고 사원의 4대보험을 넣은 뒤 그룹 ID(rdGroupId) */
    @Transactional
    public String insertRdPrint(UserPrincipal user, Long personId) {
        requirePerson(user, personId);
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), RD_WINDOW_CLASS_NAME);
        mapper.insertPrintInsure(user.getCompanyId(), user.getUserId(), RD_WINDOW_CLASS_NAME, groupId, personId);
        return String.valueOf(groupId);
    }

    private void requirePerson(UserPrincipal user, Long personId) {
        if (personId == null || mapper.countPerson(user.getCompanyId(), personId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private static <T> List<T> nz(List<T> list) {
        return list == null ? List.of() : list;
    }
}
