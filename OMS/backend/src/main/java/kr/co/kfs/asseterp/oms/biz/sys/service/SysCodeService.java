package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeByKindParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeCopyParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeCopyReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeKindMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 공통코드 (AS-IS server/sys/Sys09_Code).
 * 회사: 시스템 코드종류는 회사 0(KFS 관리자만 수정), 그 외는 로그인 회사 — KFS 관리자는 고른 회사(companyId)를 쓸 수 있다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCodeService {

    private static final long SYSTEM_COMPANY_ID = 0L;
    /** AS-IS Sys09_Grid_Code.insertRow 시작일 기본값 */
    private static final LocalDate DEFAULT_APPLY_DATE = LocalDate.of(1910, 1, 1);

    private final SysCodeMapper sysCodeMapper;
    private final SysCodeKindMapper sysCodeKindMapper;

    /** 요청한 회사: KFS 관리자만 다른 회사를 고를 수 있다 */
    static Long companyOf(UserPrincipal user, Long requested) {
        return user.companyOf(requested);
    }

    /** AS-IS selectByCodeKindId */
    public List<CodeRes> searchCodes(UserPrincipal user, Long codeKindId, Long companyId, String searchText) {
        return sysCodeMapper.searchByCodeKindId(new CodeSearchParam(codeKindId, companyOf(user, companyId),
                searchText == null ? "" : searchText.trim(), null));
    }

    /** 콤보용 코드 (AS-IS ComboBoxField → selectByCodeKind). 기준일이 없으면 오늘 */
    public List<CodeRes> searchCodesByKind(UserPrincipal user, String kindCd, LocalDate applyDate) {
        return sysCodeMapper.searchByKindCd(new CodeByKindParam(user.getCompanyId(), kindCd, applyDate == null ? LocalDate.now() : applyDate));
    }

    /** AS-IS update(UpdateDataModel) → 저장된 행(요청 순서) */
    @Transactional
    public List<CodeRes> updateCodes(UserPrincipal user, List<CodeSaveReq> rows) {
        List<CodeRes> saved = new ArrayList<>(rows.size());
        for (CodeSaveReq req : rows) {
            if (req.code() == null || req.code().isBlank() || req.name() == null || req.name().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드와 코드명을 입력하세요.");
            }
            CodeKindRes kind = sysCodeKindMapper.selectById(req.codeKindId());
            if (kind == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "코드종류를 찾을 수 없습니다.");
            }
            Long companyId = kind.sysYn() ? SYSTEM_COMPANY_ID : companyOf(user, req.companyId());
            if (kind.sysYn() && !user.isSysAdmin()) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED, "시스템 코드는 KFS 관리자만 수정할 수 있습니다.");
            }
            CodeSaveReq row = req.applyDate() != null ? req : new CodeSaveReq(req.codeId(), req.companyId(), req.codeKindId(),
                    req.code(), req.name(), req.seq(), req.closeYn(), DEFAULT_APPLY_DATE, req.closeDate(), req.note());
            Long id = req.isNew() ? sysCodeMapper.selectNextId() : req.codeId();
            if (req.isNew()) {
                sysCodeMapper.insert(CodeRow.of(id, companyId, row));
            } else if (sysCodeMapper.update(CodeRow.of(id, companyId, row)) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysCodeMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete. KFS 관리자가 아니면 로그인 회사 코드만 */
    @Transactional
    public int deleteCodes(UserPrincipal user, List<Long> codeIds) {
        if (codeIds == null || codeIds.isEmpty()) {
            return 0;
        }
        return sysCodeMapper.delete(new CodeDeleteParam(user.isSysAdmin() ? null : user.getCompanyId(), codeIds));
    }

    /** AS-IS codeInsert (코드복사) */
    @Transactional
    public int copyCodes(CodeCopyReq req) {
        int count = 0;
        for (Long companyId : req.companyIds()) {
            count += sysCodeMapper.copy(new CodeCopyParam(req.codeKindId(), req.sourceCompanyId(), companyId));
        }
        return count;
    }
}
