package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.DepnBookGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.DepnBookRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetTypeRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookDepnMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/Ast13_BookDepn.java (selectOfficeAssets L31 · selectOfficeAssetsGroup L37 · updateRetireDate L72) · Sys00_Common.selectOfficeAssets L166 · Sys99_Print.insertRdOfficeAssets L1572 — 비품관리대장 W16 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstBookDepnService {

    private static final String WINDOW = "Ast13_Tab_OfficeAssets";
    /** 소모품_비품 소분류 — 이것만 폐기/취소할 수 있다(유형/무형은 거래처리 화면) */
    public static final String CONSUMABLE_S_CLASS = "952002";

    private final AstBookDepnMapper mapper;

    public List<OfficeAssetTypeRes> searchTypes() {
        return mapper.selectOfficeAssetTypes();
    }

    /** itemLClassCode가 비면 전체('%') */
    public List<OfficeAssetRes> search(UserPrincipal user, LocalDate depnDate, String itemLClassCode, boolean retireYn, String searchText) {
        return mapper.selectOfficeAssets(user.getCompanyId(), depnDate, code(itemLClassCode), retireYn, text(searchText));
    }

    public List<OfficeAssetGroupRes> searchGroups(UserPrincipal user, LocalDate depnDate) {
        return mapper.selectOfficeAssetsGroup(user.getCompanyId(), depnDate);
    }

    /** updateRetireDate — retireDate가 null이면 폐기일을 지운다 */
    @Transactional
    public void updateRetireDate(Long bookDepnId, LocalDate retireDate) {
        if (mapper.updateRetireDate(bookDepnId, retireDate) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
    }

    /** insertRdOfficeAssets — 내 지난 출력 자료를 지우고 현재 조건의 목록을 sys99_print에 쌓아 출력그룹ID를 돌려준다 */
    @Transactional
    public Long insertRd(UserPrincipal user, LocalDate depnDate, String itemLClassCode, boolean retireYn, String searchText) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, WINDOW);
        for (OfficeAssetRes b : mapper.selectOfficeAssets(companyId, depnDate, code(itemLClassCode), retireYn, text(searchText))) {
            mapper.insertPrintOffice(mapper.selectNextId(), companyId, personId, WINDOW, groupId, b);
        }
        return groupId;
    }

    // ───── 감가상각대장 W17 (Ast13_BookDepn.selectByDepnDate2 L25 · getDepnDate2 L43 · Sys99_Print.insertRdDepnBook L1523) ─────

    private static final String DEPN_WINDOW = "Ast13_Tab_DepnBook";

    public List<OfficeAssetTypeRes> searchDepnTypes() {
        return mapper.selectDepnItemTypes();
    }

    public List<DepnBookRes> searchDepnBooks(UserPrincipal user, LocalDate depnDate, String itemLClassCode, boolean retireYn, String searchText) {
        return mapper.selectByDepnDate2(user.getCompanyId(), depnDate, code(itemLClassCode), retireYn, text(searchText));
    }

    public List<DepnBookGroupRes> searchDepnGroups(UserPrincipal user, LocalDate depnDate) {
        return mapper.selectDepnDate2Group(user.getCompanyId(), depnDate);
    }

    @Transactional
    public Long insertRdDepn(UserPrincipal user, LocalDate depnDate, String itemLClassCode, boolean retireYn, String searchText) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, DEPN_WINDOW);
        for (DepnBookRes b : mapper.selectByDepnDate2(companyId, depnDate, code(itemLClassCode), retireYn, text(searchText))) {
            mapper.insertPrintDepn(mapper.selectNextId(), companyId, personId, DEPN_WINDOW, groupId, b);
        }
        return groupId;
    }

    private static String code(String c) {
        return c == null || c.isEmpty() ? "%" : c;
    }

    private static String text(String t) {
        return t == null ? "" : t;
    }
}
