package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCodeKindMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys08_CodeKind.java (selectByKindName / update / delete) — admin 회사 메뉴라 sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCodeKindService {

    private final SysCodeKindMapper sysCodeKindMapper;

    /**
     * AS-IS selectByKindName L22-48: kindName 비면 '%', 아니면 '%값%'. sysYn 비면 'false'(A13 화면은 '%' = 전체).
     * 사용자 관리 코드구분(sysYn 'false')은 고객사 메뉴(A14 Sys08_Tab_CodeKindClient)도 조회하므로 누구나, 그 밖은 sys admin만.
     */
    public List<CodeKindRes> searchCodeKinds(UserPrincipal user, String kindName, String sysYn) {
        String like = kindName == null || kindName.isEmpty() ? "%" : "%" + kindName + "%";
        String sys = sysYn == null || sysYn.isEmpty() ? "false" : sysYn;
        if (!"false".equals(sys)) {
            requireSysAdmin(user);
        }
        return sysCodeKindMapper.searchCodeKinds(new CodeKindSearchParam(like, sys));
    }

    /**
     * AS-IS update(UpdateDataModel) L60-63: 행마다 신규면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     * 신규 판정은 화면 임시 ID(0 이하). 코드구분·코드구분명은 DB NOT NULL이라 미리 막는다(05 §6 DB 오류).
     */
    @Transactional
    public List<CodeKindRes> updateCodeKinds(UserPrincipal user, List<CodeKindSaveReq> rows) {
        requireSysAdmin(user);
        List<CodeKindRes> saved = new ArrayList<>();
        for (CodeKindSaveReq req : rows) {
            if (req.kindCd() == null || req.kindCd().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드구분을 입력하세요.");
            }
            if (req.kindNm() == null || req.kindNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드구분명을 입력하세요.");
            }
            boolean isNew = req.codeKindId() == null || req.codeKindId() <= 0;
            Long codeKindId = isNew ? sysCodeKindMapper.selectNextId() : req.codeKindId();
            CodeKindSaveReq row = new CodeKindSaveReq(codeKindId, req.kindCd(), req.kindNm(),
                    req.sysYn() == null ? "false" : req.sysYn(), req.note());
            if (isNew) {
                sysCodeKindMapper.insertCodeKind(row);
            } else if (sysCodeKindMapper.updateCodeKind(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysCodeKindMapper.selectCodeKind(codeKindId));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) L65-69: 하위 코드 검사 없음(원본 그대로) → 지운 건수 */
    @Transactional
    public int deleteCodeKinds(UserPrincipal user, List<Long> codeKindIds) {
        requireSysAdmin(user);
        if (codeKindIds == null || codeKindIds.isEmpty()) {
            return 0;
        }
        return sysCodeKindMapper.deleteCodeKinds(codeKindIds);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
