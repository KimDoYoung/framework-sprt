package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.PriceRes;
import kr.co.kfs.asseterp.biz.ast.dto.PrcRes;
import kr.co.kfs.asseterp.biz.ast.dto.PrcSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.PriceSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstPriceMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** AS-IS server/ast/Ast25_Price.java (selectHoldItem L32 · insert L75) — 시세입력 조회창 Ast25_Lookup_Price (W09), 시세관리 Ast25_Tab_Price(W10)도 쓴다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstPriceService {

    private final AstPriceMapper mapper;

    /** ast25_price.selectHoldItem — 국내(abroType "1") 고정, 종목유형 비면 %, 검색어는 앞뒤 % */
    public List<PriceRes> holdItems(UserPrincipal user, LocalDate holdDate, String itemType, String searchText) {
        return mapper.selectHoldItem(user.getCompanyId(), holdDate, "1",
                itemType == null || itemType.isBlank() ? "%" : itemType, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * Ast25_Price.insert — 종목코드가 없으면 실패. 같은 회사·기준일·종목유형·종목코드 시세가 없으면 새 ID로 넣고, 있으면 단가만 바꾼다
     */
    @Transactional
    public void save(UserPrincipal user, PriceSaveReq req) {
        Long companyId = user.getCompanyId();
        for (PriceSaveReq.Row r : req.rows()) {
            if (r.itemCode() == null || r.itemCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "종목코드가 존재하지 않습니다. 고유자산 기본등록 화면에서 종목코드를 등록하세요");
            }
            Long priceId = mapper.selectPriceId(companyId, r.stdDate(), r.itemType(), r.itemCode());
            if (priceId == null) {
                mapper.upsert(mapper.selectNextId(), companyId, r.stdDate(), r.itemType(), r.itemCode(), r.itemName(), r.evalPrice(), r.note());
            } else {
                mapper.updateEvalPrice(priceId, r.evalPrice());
            }
        }
    }

    /** Ast25_Price.selectByStdDatePaging — 고객사 시세 + 공용 시세. 검색어는 앞뒤 %, 종목유형 비면 % */
    public PageRes<PrcRes> searchPaging(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String itemType, String searchText,
                                        boolean holdYn, int limit, int offset) {
        String type = itemType == null || itemType.isBlank() ? "%" : itemType;
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        long total = mapper.selectByStdDatePagingTotal(user.getCompanyId(), startDate, closeDate, type, text, holdYn);
        return new PageRes<>(total, mapper.selectByStdDatePaging(user.getCompanyId(), startDate, closeDate, type, text, holdYn, limit, offset));
    }

    /**
     * Ast25_Price.upsert — 공용 시세(lockYn)는 고객사 시세로 새 ID를 받아 만든다. 저장 전 같은 회사·기준일·종목유형·종목코드가 있으면 실패.
     * 새 행(priceId 0 이하)도 새 ID. 요청과 같은 순서로 저장된 ID를 돌려준다
     */
    @Transactional
    public List<Long> upsert(UserPrincipal user, PrcSaveReq req) {
        Long companyId = user.getCompanyId();
        List<Long> ids = new ArrayList<>();
        for (PrcSaveReq.Row r : req.rows()) {
            long priceId = r.priceId() == null || r.priceId() <= 0 || Boolean.TRUE.equals(r.lockYn()) ? mapper.selectNextId() : r.priceId();
            if (mapper.checkItemCode(priceId, companyId, r.stdDate(), r.itemType(), r.itemCode()) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "\"" + r.itemName() + "(" + r.itemCode() + ")\" 종목이 이미 존재합니다.");
            }
            mapper.upsert(priceId, companyId, r.stdDate(), r.itemType(), r.itemCode(), r.itemName(), r.evalPrice(), r.note());
            ids.add(priceId);
        }
        return ids;
    }

    /** Ast25_Price.delete — 공용 시세는 클라이언트가 막는다(서버는 회사 조건으로 고객사 행만 지운다) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
