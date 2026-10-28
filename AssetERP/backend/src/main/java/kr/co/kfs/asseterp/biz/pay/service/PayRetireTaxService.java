package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxAmountReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxDetailRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxOfficeSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayRetireMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/** 퇴직정산 소득세 탭 Pay13_TabPage_RetireTax (S22) — AS-IS pay.Pay13_RetireTax · Pay14_RetireTaxItem, 재계산은 f_calc_income_tax_retire(menuNum) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayRetireTaxService {

    private static final Set<Integer> ITEM_MENUS = Set.of(1, 4, 7);
    private static final Set<Integer> AMOUNT_MENUS = Set.of(2, 3, 5, 6, 8, 10);
    private static final int OFFICE_MENU = 9;

    private final PayRetireMapper mapper;

    /** retrieve(): 항목 3종(1·3·4) + 기납부세액 + 금액 필드(없으면 tax null) */
    public PayRetireTaxDetailRes detail(UserPrincipal user, Long monthId) {
        requireMonth(user, monthId, null);
        return new PayRetireTaxDetailRes(mapper.selectTax(monthId),
                mapper.selectTaxItems(monthId, "1"), mapper.selectTaxItems(monthId, "3"), mapper.selectTaxItems(monthId, "4"),
                mapper.selectOfficePayTax(monthId));
    }

    /** pay.Pay14_RetireTaxItem.insertRetireTaxItem — 행 저장·삭제 뒤 소득세 재계산(저장·삭제 대상은 monthId의 행만) */
    @Transactional
    public void saveItems(UserPrincipal user, PayRetireTaxItemSaveReq req) {
        if (!ITEM_MENUS.contains(req.menuNum())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        requireMonth(user, req.monthId(), req.personId());
        for (PayRetireTaxItemRes row : nz(req.updates())) {
            mapper.upsertTaxItem(new PayRetireTaxItemRes(row.retireTaxItemId(), req.monthId(), row.itemType(), row.itemName(), row.itemAmt(), row.pyItemAmt()));
        }
        for (Long id : nz(req.deleteIds())) {
            mapper.deleteTaxItem(req.monthId(), id);
        }
        recalc(req.personId(), req.menuNum());
    }

    /** pay.Pay13_RetireTax.insertRetireTax — 2·3·5·6·8·10 금액 저장 뒤 재계산 */
    @Transactional
    public void saveAmount(UserPrincipal user, PayRetireTaxAmountReq req) {
        if (!AMOUNT_MENUS.contains(req.menuNum())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        requireMonth(user, req.monthId(), req.personId());
        mapper.updateTaxAmt(req.monthId(), req.menuNum(), req.itemAmt(), req.pyItemAmt());
        recalc(req.personId(), req.menuNum());
    }

    /** pay.Pay13_RetireTax.insertOfficePayTax — 9. 기납부세액 저장 뒤 재계산 */
    @Transactional
    public void saveOfficePayTax(UserPrincipal user, PayRetireTaxOfficeSaveReq req) {
        requireMonth(user, req.monthId(), req.personId());
        mapper.updateOfficePayTax(req.monthId(), req.preOfficePayTax(), req.pyPreOfficePayTax(), req.curOfficePayTax(), req.pyCurOfficePayTax());
        recalc(req.personId(), OFFICE_MENU);
    }

    private void recalc(Long personId, int menuNum) {
        String msg = mapper.callIncomeTaxRetire(personId, null, menuNum);
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        }
    }

    private void requireMonth(UserPrincipal user, Long monthId, Long personId) {
        if (monthId == null || mapper.countMonth(user.getCompanyId(), monthId, personId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private static <T> List<T> nz(List<T> list) {
        return list == null ? List.of() : list;
    }
}
