package kr.co.kfs.asseterp.biz.icr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleContentReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleSaveReq;
import kr.co.kfs.asseterp.biz.icr.mapper.IcrClassTreeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/icr/Icr01_ClassTree.java 중 내규관리 그리드 (selectByClassTreeId L43 / refresh L242 / update L295 / modelUpdate L287 / delete L300)
 * + sys.Sys10_File.delete(서식파일 행 삭제, Icr01_Lookup_IcrFile) — H09 Icr01_Grid_IcrType.
 * 모두 로그인 회사의 내규만 읽고 고친다(AS-IS는 클라이언트가 보낸 id를 그대로 믿는다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcrRuleService {

    /** AS-IS Icr01_Grid_IcrType.retrieve: 내규 구분은 'IT' */
    private static final String TYPE_CODE = "IT";

    private final IcrClassTreeMapper mapper;

    /** AS-IS selectByClassTreeId: 고른 분류와 모든 하위의 내규. 검색어는 분류코드+내규명 LIKE %…% */
    public List<IcrRuleRes> search(UserPrincipal user, Long classTreeId, String searchText) {
        String like = (searchText == null || searchText.isEmpty()) ? null : "%" + searchText + "%";
        return mapper.selectRules(user.getCompanyId(), classTreeId, TYPE_CODE, like);
    }

    /** AS-IS refresh: 한 행을 다시 읽는다(조회창을 닫은 뒤) */
    public IcrRuleRes refresh(UserPrincipal user, Long classTreeId) {
        IcrRuleRes row = mapper.selectRuleRefresh(user.getCompanyId(), classTreeId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /**
     * AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행(id ≤ 0 또는 DB에 없음)은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 검사는 Icr01_Grid_IcrType.update L232-262 순서 그대로 — 내규명, 분류코드. 세 번째 "주기정보를 등록해 주세요"는 화면이 가진 주기 열을 보는 검사라 화면에서 한다
     */
    @Transactional
    public List<IcrRuleRes> save(UserPrincipal user, List<IcrRuleSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(req -> {
            if (req.classTreeName() == null || req.classTreeName().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "내규명을 입력해 주세요");
            }
            if (req.classTreeCode() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "분류코드를 입력해 주세요");
            }
            boolean exists = req.classTreeId() != null && req.classTreeId() > 0 && mapper.countById(companyId, req.classTreeId()) > 0;
            if (exists) {
                mapper.updateRule(companyId, req);
                return mapper.selectRuleRefresh(companyId, req.classTreeId());
            }
            if (req.parentTreeId() == null || mapper.countById(companyId, req.parentTreeId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            long newId = mapper.selectNextId();
            mapper.insertRule(newId, req, companyId);
            return mapper.selectRuleRefresh(companyId, newId);
        }).toList();
    }

    /** AS-IS delete(GridDeleteData → deleteModel): id마다 DELETE → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> classTreeIds) {
        int count = 0;
        for (Long id : classTreeIds) {
            count += mapper.deleteRule(user.getCompanyId(), id);
        }
        return count;
    }

    /** AS-IS Icr01_Lookup_Content.update → icr.Icr01_ClassTree.modelUpdate → 저장된 행 */
    @Transactional
    public IcrRuleRes updateContent(UserPrincipal user, Long classTreeId, IcrRuleContentReq req) {
        if (req.classTreeName() == null || req.classTreeName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "내규명을 입력해 주세요");
        }
        if (req.classTreeCode() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류코드를 입력해 주세요");
        }
        if (mapper.updateRuleContent(user.getCompanyId(), classTreeId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectRuleRefresh(user.getCompanyId(), classTreeId);
    }

    /**
     * AS-IS Icr01_Lookup_IcrFile 삭제 열 → GridDeleteData → sys.Sys10_File.delete(deleteModel): sys10_file 행만 지운다(저장된 파일은 그대로).
     * 내규가 로그인 회사 것이고 파일이 그 내규에 달린 것일 때만
     */
    @Transactional
    public void deleteFile(UserPrincipal user, Long classTreeId, Long fileId) {
        if (mapper.countById(user.getCompanyId(), classTreeId) == 0 || mapper.deleteFileRow(classTreeId, fileId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
