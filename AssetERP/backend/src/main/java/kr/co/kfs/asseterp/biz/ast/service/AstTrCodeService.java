package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.TrCodeInitReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrCodeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/ast/Ast05_TrCode.java (selectByCompanyId L31, insertInitData L49, update L66, delete L94) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrCodeService {

    private static final String ASSET_TYPE = "1";

    private final AstTrCodeMapper mapper;

    /** AS-IS Ast05_Tab_TrCodeAdmin.retrieve() L276-293: 로그인 회사, "%검색어%", 사용항목만 보기, 자산구분 "1" */
    public List<TrCodeRes> search(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%", String.valueOf(useYn), ASSET_TYPE);
    }

    /**
     * AS-IS Ast05_Lookup_TrCode.retrieve() L329-363: 로그인 회사, 사용 중인 코드만, "%검색어%", 수령/지급(없으면 "%"), 자산구분, 금융상품거래(없으면 전체).
     * 자산구분은 원본 SQL처럼 LIKE로 맞춘다(호출한 화면이 "1"을 넘긴다)
     */
    public List<TrCodeRes> lookup(UserPrincipal user, String searchText, String rcvPayCode, String assetType, Boolean financeYn) {
        return mapper.selectBySearchText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%",
                isBlank(rcvPayCode) ? "%" : rcvPayCode, assetType, financeYn == null ? null : String.valueOf(financeYn));
    }

    /**
     * AS-IS update L66-92: 같은 회사에 같은 거래코드가 다른 행으로 있으면 막고, UpdateDataModel처럼 신규(ID 0 이하)는 INSERT, 아니면 UPDATE 후
     * selectById로 다시 읽어 요청 순서대로 돌려준다. 필수 검사(거래코드·거래명·수령/지급)는 화면 update() L303-315와 같은 문구
     */
    @Transactional
    public List<TrCodeRes> update(UserPrincipal user, List<TrCodeSaveReq> rows) {
        for (TrCodeSaveReq req : rows) {
            if (isBlank(req.trCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "거래코드는 필수입력 항목입니다.");
            }
            if (isBlank(req.trName())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "거래명은 필수입력 항목입니다.");
            }
            if (isBlank(req.rcvPayCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "수령/지급은 필수입력 항목입니다.");
            }
        }
        List<TrCodeRes> saved = new ArrayList<>();
        for (TrCodeSaveReq req : rows) {
            boolean isNew = req.trCodeId() == null || req.trCodeId() <= 0;
            Long sameCodeId = mapper.checkTrCode(user.getCompanyId(), req.trCode());
            if (sameCodeId != null && (isNew || !sameCodeId.equals(req.trCodeId()))) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "동일한 거래코드가 존재합니다. 확인하여 주십시오. (거래코드:" + req.trCode() + ")");
            }
            Long id = isNew ? mapper.selectNextId() : req.trCodeId();
            if (isNew) {
                mapper.insert(id, user.getCompanyId(), req);
            } else if (mapper.update(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /**
     * AS-IS insertInitData L49-64: 고른 거래코드마다 고른 고객사에서 같은 코드를 지우고 관리자 회사 것을 복사한다 → 처리한 고객사 수.
     * 원본은 고객사마다 서비스를 따로 불렀다 — 여기서는 한 트랜잭션. 관리자 회사만(원본은 막지 않았다)
     */
    @Transactional
    public int insertInitData(UserPrincipal user, TrCodeInitReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<Long> companyIds = req.companyIds() == null ? List.of() : req.companyIds();
        List<String> codes = req.trCodes() == null ? List.of() : req.trCodes();
        for (Long companyId : companyIds) {
            for (String code : codes) {
                mapper.deleteByTrCode(companyId, code);
                mapper.insertInitData(companyId, code);
            }
        }
        return companyIds.size();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }
}
