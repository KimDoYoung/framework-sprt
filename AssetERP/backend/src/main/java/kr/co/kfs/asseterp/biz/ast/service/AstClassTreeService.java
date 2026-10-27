package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.AstAssetItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemClassUpdateReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeCond;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstClassTreeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    public List<AstAssetItemRes> searchByAssetType(UserPrincipal user, LocalDate stdDate, String assetType, String searchText) {
        return mapper.selectByAssetType(user.getCompanyId(), stdDate, assetType, searchText == null ? "" : searchText);
    }

    /** R08·R09 본 화면 전체 트리 조회 (AS-IS ast01_class_tree.selectByCompanyId) */
    public List<AstClassTreeRes> searchClassTree(UserPrincipal user, String typeCode, String assetType) {
        String type = (typeCode == null || typeCode.isBlank()) ? "IC" : ("%".equals(typeCode) ? null : typeCode);
        String asset = (assetType == null || assetType.isBlank() || "%".equals(assetType)) ? null : assetType;
        return mapper.selectClassTree(user.getCompanyId(), type, asset);
    }

    /** R08 우측 종목 상세 목록 (AS-IS ast01_class_tree.selectByParentId) */
    public List<AstClassTreeItemRes> searchByParentId(UserPrincipal user, Long parentId, String typeCode) {
        String type = (typeCode == null || typeCode.isBlank()) ? "IT" : typeCode;
        return mapper.selectByParentId(user.getCompanyId(), parentId, type);
    }

    /** 코드 채번 (AS-IS ast01_class_tree.createCode) */
    public String createCode(UserPrincipal user, Long parentId, String typeCode) {
        return mapper.createCode(user.getCompanyId(), parentId != null ? parentId : 0L, typeCode);
    }

    /** 분류 등록/수정 (AS-IS Ast01_Edit_ClassTree) */
    @Transactional
    public Long saveClassTree(UserPrincipal user, AstClassTreeSaveReq req) {
        if (req.classTreeId() == null || req.classTreeId() <= 0) {
            long newId = mapper.selectNextId();
            String code = req.classTreeCode();
            if (code == null || code.isBlank()) {
                code = mapper.createCode(user.getCompanyId(), req.parentTreeId() != null ? req.parentTreeId() : 0L, req.typeCode());
            }
            AstClassTreeRes row = new AstClassTreeRes(
                    newId,
                    user.getCompanyId(),
                    req.parentTreeId() != null ? req.parentTreeId() : 0L,
                    req.classTreeName(),
                    code,
                    req.seq() != null ? req.seq() : 1L,
                    req.typeCode(),
                    req.note(),
                    req.useYn() != null ? req.useYn() : "true",
                    null,
                    req.isin(),
                    null, null, null, null, null,
                    req.assetType(),
                    null, null, null, null, null, null, null, null, null,
                    null, null, null, null, null, null, null, null, null, null, null, null, 1
            );
            mapper.insertClassTree(row);
            return newId;
        } else {
            AstClassTreeRes existing = mapper.selectById(req.classTreeId());
            if (existing == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "존재하지 않는 분류입니다.");
            }
            AstClassTreeRes row = new AstClassTreeRes(
                    req.classTreeId(),
                    user.getCompanyId(),
                    existing.parentTreeId(),
                    req.classTreeName(),
                    existing.classTreeCode(),
                    req.seq() != null ? req.seq() : existing.seq(),
                    existing.typeCode(),
                    req.note(),
                    req.useYn() != null ? req.useYn() : existing.useYn(),
                    existing.content(),
                    req.isin(),
                    existing.itemLClassCode(),
                    existing.itemMClassCode(),
                    existing.itemSClassCode(),
                    existing.itemDClassCode(),
                    existing.accountType(),
                    req.assetType() != null ? req.assetType() : existing.assetType(),
                    existing.trUnit(),
                    existing.issueDate(),
                    existing.matDate(),
                    existing.corpId(),
                    existing.curCode(),
                    existing.depnYear(),
                    existing.depnRate(),
                    existing.depnType(),
                    existing.evalType(),
                    null, null, null, null, null, null, null, null, null, null, null, null, 1
            );
            mapper.updateClassTree(row);
            return req.classTreeId();
        }
    }

    /** 우측 종목 그리드 일괄 저장 (AS-IS Ast01_ClassTree.insert) */
    @Transactional
    public void saveItems(UserPrincipal user, Long parentId, List<AstClassTreeSaveReq> items) {
        AstClassTreeRes parent = mapper.selectById(parentId);
        for (AstClassTreeSaveReq item : items) {
            if (item.classTreeId() == null || item.classTreeId() <= 0) {
                long newId = mapper.selectNextId();
                String code = mapper.createCode(user.getCompanyId(), parentId, "IT");
                AstClassTreeRes newRow = new AstClassTreeRes(
                        newId,
                        user.getCompanyId(),
                        parentId,
                        item.classTreeName(),
                        code,
                        item.seq() != null ? item.seq() : 1L,
                        "IT",
                        item.note(),
                        item.useYn() != null ? item.useYn() : "true",
                        parent != null ? parent.content() : null,
                        item.isin(),
                        parent != null ? parent.itemLClassCode() : null,
                        parent != null ? parent.itemMClassCode() : null,
                        parent != null ? parent.itemSClassCode() : null,
                        parent != null ? parent.itemDClassCode() : null,
                        parent != null ? parent.accountType() : null,
                        parent != null ? parent.assetType() : null,
                        parent != null ? parent.trUnit() : null,
                        null, null,
                        parent != null ? parent.corpId() : null,
                        parent != null ? parent.curCode() : null,
                        parent != null ? parent.depnYear() : null,
                        parent != null ? parent.depnRate() : null,
                        parent != null ? parent.depnType() : null,
                        parent != null ? parent.evalType() : null,
                        null, null, null, null, null, null, null, null, null, null, null, null, 1
                );
                mapper.insertClassTree(newRow);
            } else {
                mapper.updateClassTreeInfo(
                        item.classTreeId(),
                        item.classTreeName(),
                        item.seq() != null ? item.seq() : 1L,
                        item.useYn() != null ? item.useYn() : "true"
                );
            }
        }
    }

    /** 상위분류 변경 (이동) (AS-IS ast01_class_tree.updateParentId) */
    @Transactional
    public void updateParentId(UserPrincipal user, Long classTreeId, Long parentId) {
        mapper.updateParentId(classTreeId, parentId);
    }

    /** 추가정보 수정 (AS-IS ast01_class_tree.modelUpdate) */
    @Transactional
    public void modelUpdate(UserPrincipal user, AstItemClassUpdateReq req) {
        mapper.modelUpdate(req);
    }

    /** 삭제 (AS-IS Ast01_ClassTree.delete) */
    @Transactional
    public void deleteClassTree(UserPrincipal user, Long classTreeId) {
        int cnt = mapper.checkUseAstId(classTreeId);
        if (cnt > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 종목입니다.");
        }
        mapper.deleteByAstClassTreeId(classTreeId);
        mapper.deleteManagerByLinkId(classTreeId);
        mapper.deleteClassTree(classTreeId);
    }
}
