package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayApprCheckRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemAmountReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemBulkReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemTextRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthItemMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * AS-IS server/pay/Pay11_MonthItem.java (selectByItemType L38 / updateList L116 / getInsureAdjustModi L158 / recalculationTax L340) — 급여 항목 (S16)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayMonthItemService {

    /** 4대보험 연말정산 납부 항목 → f_create_4insure_adjust_modi의 insureCode */
    private static final Map<String, String> ADJUST_INSURE_CODE = Map.of("221", "2", "231", "3", "241", "4");

    /** S17 [출력/다운로드] 출력 자료의 window class (AS-IS windowClassName) */
    private static final String RD_WINDOW_CLASS_NAME = "Pay10_Tab_MonthItem";

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

    /** S17 pay11_month_item.selectByText — 구분·지급일의 전체 사원 항목. 항목 코드 기본 "%", 검색어는 "%…%"(사원명+항목명) */
    public List<PayMonthItemTextRes> searchByText(UserPrincipal user, String payCode, LocalDate payDate, String itemCode, String searchText) {
        return mapper.selectByText(user.getCompanyId(), payCode, payDate, blank(itemCode) ? "%" : itemCode, "%" + nvl(searchText) + "%");
    }

    /**
     * S17 AS-IS updateMonthItemList L262: 행마다 upsert → 지급(1)이면 소득세·지방세 재계산, 공제(2)의 221·231·241이면 연말정산 검증.
     * 화면이 [저장] 앞에서 하던 checkAppr를 서버도 한다(TOBE 추가). 금액이 비면 DB 오류가 나므로 서버가 먼저 막는다
     */
    @Transactional
    public void saveAmounts(UserPrincipal user, List<PayMonthItemAmountReq> rows) {
        if (rows == null || rows.isEmpty()) {
            return;
        }
        Map<Long, PayMonthRes> months = new LinkedHashMap<>();
        monthMapper.selectByIds(user.getCompanyId(), rows.stream().map(PayMonthItemAmountReq::monthId).distinct().toList())
                .forEach(m -> months.put(m.monthId(), m));
        Set<String> checked = new HashSet<>();
        for (PayMonthItemAmountReq row : rows) {
            PayMonthRes month = months.get(row.monthId());
            if (month == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (!"1".equals(row.itemType()) && !"2".equals(row.itemType())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            if (row.itemAmt() == null || blank(row.itemCd())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "금액을 입력해주세요");
            }
            if (checked.add(month.payCd() + "/" + month.date())) {
                requireAppr(user, month);
            }
        }
        for (PayMonthItemAmountReq row : rows) {
            PayMonthRes month = months.get(row.monthId());
            mapper.updateModel(month.monthId(), row.itemType(), row.itemCd(), row.itemAmt(), row.monthItemId());
            if ("1".equals(row.itemType())) {
                recalculateTax(month);
            } else {
                verifyAdjust(month, row.itemCd());
            }
        }
    }

    /** S17 AS-IS insertItemType L83: 구분·지급일의 모든 사원에게 금액 0으로 항목 추가(중복 검사 없음 — 원본 그대로) → 추가한 건수 */
    @Transactional
    public int insertBulk(UserPrincipal user, PayMonthItemBulkReq req) {
        if (blank(req.payCode()) || req.payDate() == null || blank(req.itemCode())
                || (!"1".equals(req.itemType()) && !"2".equals(req.itemType()))
                || mapper.countItem(req.itemType(), req.itemCode()) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        List<PayMonthRes> months = monthMapper.selectByCompanyId(user.getCompanyId(), req.payCode(), req.payDate());
        for (PayMonthRes month : months) {
            monthMapper.insertItem(monthMapper.selectNextId(), month.monthId(), req.itemType(), req.itemCode(), 0L);
        }
        return months.size();
    }

    /** S17 AS-IS Sys99_Print.insertRdMonthItem L2542: 내 지난 출력 자료 정리 → 목록 삽입 → 출력 자료 groupId */
    @Transactional
    public String insertRdPrint(UserPrincipal user, String payCode, LocalDate payDate, String itemCode, String searchText) {
        if (blank(payCode) || payDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        long groupId = monthMapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), RD_WINDOW_CLASS_NAME);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), RD_WINDOW_CLASS_NAME, groupId, payCode, payDate,
                blank(itemCode) ? "%" : itemCode, "%" + nvl(searchText) + "%");
        return String.valueOf(groupId);
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
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
