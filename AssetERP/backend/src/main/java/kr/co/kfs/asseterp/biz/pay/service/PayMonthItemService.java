package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayApprCheckRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthItemMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * AS-IS server/pay/Pay11_MonthItem.java (selectByItemType L38 / updateList L116 / getInsureAdjustModi L158 / recalculationTax L340) — 급여 항목 (S16)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayMonthItemService {

    /** 4대보험 연말정산 납부 항목 → f_create_4insure_adjust_modi의 insureCode */
    private static final Map<String, String> ADJUST_INSURE_CODE = Map.of("221", "2", "231", "3", "241", "4");

    private final PayMonthItemMapper mapper;
    private final PayMonthMapper monthMapper;
    private final PayMonthService monthService;

    /** pay11_month_item.selectByItemType — itemType 1 지급 / 2 공제 */
    public List<PayMonthItemRes> search(UserPrincipal user, Long monthId, String itemType) {
        month(user, monthId);
        return mapper.selectByItemType(monthId, itemType);
    }

    /**
     * 지급(1): AS-IS updateList — 행 저장(upsert) → 삭제 → 소득세 250·지방세 260 재계산.
     * 공제(2): AS-IS getInsureAdjustModi — 행 저장/삭제마다 221·231·241이면 연말정산 검증, 'Y'가 아니면 그 문구로 실패(전부 되돌림), 세금 재계산 없음
     */
    @Transactional
    public void save(UserPrincipal user, PayMonthItemSaveReq req) {
        PayMonthRes month = month(user, req.monthId());
        String itemType = req.itemType();
        if (!"1".equals(itemType) && !"2".equals(itemType)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        requireAppr(user, month);
        boolean adjust = "2".equals(itemType);
        List<PayMonthItemSaveReq.Row> updateList = req.updateList() == null ? List.of() : req.updateList();
        List<Long> deleteIds = req.deleteIds() == null ? List.of() : req.deleteIds();

        for (PayMonthItemSaveReq.Row row : updateList) {
            mapper.updateModel(month.monthId(), itemType, row.itemCd(), row.itemAmt(), row.monthItemId());
            if (adjust) {
                verifyAdjust(month, row.itemCd());
            }
        }
        for (Long monthItemId : deleteIds) {
            String itemCd = mapper.selectItemCode(month.monthId(), monthItemId);
            mapper.deleteByMonthItemId(month.monthId(), monthItemId);
            if (adjust && itemCd != null) {
                verifyAdjust(month, itemCd);
            }
        }
        if (!adjust) {
            recalculateTax(month);
        }
    }

    /** AS-IS recalculationTax: 소득세 250·지방세 260 다시 계산 */
    @Transactional
    public void recalculateTax(UserPrincipal user, Long monthId) {
        PayMonthRes month = month(user, monthId);
        requireAppr(user, month);
        recalculateTax(month);
    }

    private void requireAppr(UserPrincipal user, PayMonthRes month) {
        PayApprCheckRes check = monthService.checkAppr(user, month.payCd(), month.date(), month.monthId());
        if (!check.ok()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, check.message());
        }
    }

    private void recalculateTax(PayMonthRes month) {
        mapper.updateItemAmt(month.monthId(), "250", mapper.getIncomeTax(month.monthId()));
        mapper.updateItemAmt(month.monthId(), "260", mapper.getLocalTax(month.date(), month.monthId()));
    }

    private void verifyAdjust(PayMonthRes month, String itemCd) {
        String insureCode = ADJUST_INSURE_CODE.get(itemCd);
        if (insureCode == null) {
            return;
        }
        String msg = mapper.getInsureAdjustModi(month.personId(), insureCode, month.date());
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        }
    }

    /** 급여 행을 서버가 다시 읽는다(회사 범위) — 없으면 못 찾음 */
    private PayMonthRes month(UserPrincipal user, Long monthId) {
        List<PayMonthRes> rows = monthMapper.selectByIds(user.getCompanyId(), List.of(monthId));
        if (rows.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return rows.get(0);
    }
}
