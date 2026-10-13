package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminRow;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeCopyReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeDeleteParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeListParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCodeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys09_Code.java (selectByCodeKind — 공통코드 콤보, selectByCodeKindId / update / delete — 코드 관리) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCodeService {

    private final SysCodeMapper sysCodeMapper;

    /** 로그인 회사의 코드(시스템 코드는 admin 회사 0의 것), 오늘 기준 */
    public List<CodeRes> searchCodes(UserPrincipal user, String kindCd) {
        return sysCodeMapper.searchCodesByKind(new CodeSearchParam(user.getCompanyId(), kindCd));
    }

    // ── A13 Sys09_Grid_Code: 코드 관리 ──

    /**
     * AS-IS selectByCodeKindId L32-40. 코드구분이 시스템이면 SQL이 회사 0으로 바꾼다.
     * 회사는 로그인 회사(sys admin만 다른 회사를 지정 — A14가 고객사를 고른다).
     */
    public List<CodeAdminRes> searchCodesByKindId(UserPrincipal user, Long codeKindId, Long companyId, String searchText) {
        return sysCodeMapper.searchCodesByKindId(new CodeListParam(codeKindId, user.companyOf(companyId),
                searchText == null ? "" : searchText));
    }

    /**
     * AS-IS update(UpdateDataModel) L381-384: 행마다 신규면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     * 코드(10자)·코드명·시작일자는 DB NOT NULL/길이 제한이라 미리 막는다(05 §6 DB 오류).
     */
    @Transactional
    public List<CodeAdminRes> updateCodes(UserPrincipal user, List<CodeAdminSaveReq> rows) {
        List<CodeAdminRes> saved = new ArrayList<>();
        for (CodeAdminSaveReq req : rows) {
            if (req.code() == null || req.code().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드를 입력하세요.");
            }
            if (req.code().length() > 10) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드는 10자 이내로 입력하세요.");
            }
            if (req.name() == null || req.name().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드명을 입력하세요.");
            }
            if (req.applyDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일자를 입력하세요.");
            }
            boolean isNew = req.codeId() == null || req.codeId() <= 0;
            Long codeId = isNew ? sysCodeMapper.selectNextId() : req.codeId();
            CodeAdminRow row = new CodeAdminRow(codeId, req.codeKindId(), user.companyOf(req.companyId()), req.code(),
                    req.name(), req.seq(), req.closeYn() == null ? "false" : req.closeYn(), req.applyDate(),
                    req.closeDate(), req.note());
            if (isNew) {
                sysCodeMapper.insertCode(row);
            } else if (sysCodeMapper.updateCode(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysCodeMapper.selectCode(codeId));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) L386-389: 체크한 행 삭제 → 지운 건수. 회사 범위 안에서만 */
    @Transactional
    public int deleteCodes(UserPrincipal user, Long companyId, List<Long> codeIds) {
        if (codeIds == null || codeIds.isEmpty()) {
            return 0;
        }
        return sysCodeMapper.deleteCodes(new CodeDeleteParam(user.companyOf(companyId), codeIds));
    }

    /**
     * AS-IS codeInsert L271-310 (A14 코드복사): 고른 회사마다 원본 회사(화면의 현재 회사)의 코드를 복사 → 복사한 행 수.
     * 버튼이 admin 회사에만 있으므로 sys admin만.
     */
    @Transactional
    public int copyCodes(UserPrincipal user, Long codeKindId, CodeCopyReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        int count = 0;
        for (Long newCompanyId : req.companyIds()) {
            count += sysCodeMapper.copyCodes(req.companyId(), newCompanyId, codeKindId);
        }
        return count;
    }
}
