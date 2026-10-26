package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.AstAssetItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeCond;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstClassTreeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/ast/Ast01_ClassTree.java selectByCompanyId L32 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstClassTreeService {

    private final AstClassTreeMapper mapper;
    private final EmpTransInfoService transInfoService;

    /**
     * 종목별 문서검색 트리(Apr01_Tab_ItemDocument.retrieve): typeCode %, assetType이 비면 %.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0
     */
    public List<AstItemTreeRes> searchItemTree(UserPrincipal user, String assetType) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        String asset = assetType == null || assetType.isEmpty() ? "%" : assetType;
        return mapper.selectItemTree(new AstItemTreeCond(user.getCompanyId(), user.getUserId(), orgId, "%", asset));
    }

    /** AS-IS Ast01_ClassTree.selectByAssetType L147 (P10). 회사는 로그인 회사, 검색어는 SQL이 %…%로 감싼다 */
    public List<AstAssetItemRes> searchByAssetType(UserPrincipal user, java.time.LocalDate stdDate, String assetType, String searchText) {
        return mapper.selectByAssetType(user.getCompanyId(), stdDate, assetType, searchText == null ? "" : searchText);
    }
}
