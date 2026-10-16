package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupKeyParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupMemberParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupMemberSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRenameParam;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRow;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCodeGroupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys13_CodeGroup.java — 코드 그룹(admin 회사 메뉴 팝업)이라 sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCodeGroupService {

    private final SysCodeGroupMapper sysCodeGroupMapper;

    /** AS-IS selectByGroupCodeKind L25-32: 코드구분의 그룹 헤더(code_id = 0) */
    public List<CodeGroupRes> searchGroups(UserPrincipal user, Long codeKindId) {
        requireSysAdmin(user);
        return sysCodeGroupMapper.searchGroups(codeKindId);
    }

    /**
     * AS-IS update L72-91: 이미 있는 행(selectById)이면 옛 그룹코드·설명이 같은 모든 행(소속 코드 포함)의 값을 새 값으로 바꾸고,
     * 이어서 UpdateDataModel이 헤더 행을 INSERT/UPDATE 한다. 그룹코드·설명은 DB NOT NULL이라 미리 막는다(05 §6).
     */
    @Transactional
    public List<CodeGroupRes> updateGroups(UserPrincipal user, List<CodeGroupSaveReq> rows) {
        requireSysAdmin(user);
        List<CodeGroupRes> saved = new ArrayList<>();
        for (CodeGroupSaveReq req : rows) {
            if (req.kindGroupCd() == null || req.kindGroupCd().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "그룹코드를 입력하세요.");
            }
            if (req.kindGroupNm() == null || req.kindGroupNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "그룹설명을 입력하세요.");
            }
            boolean isNew = req.codeGroupId() == null || req.codeGroupId() <= 0;
            Long codeGroupId = req.codeGroupId();
            if (isNew) {
                codeGroupId = sysCodeGroupMapper.selectNextId();
                sysCodeGroupMapper.insertGroup(new CodeGroupRow(codeGroupId, req.kindGroupCd(), req.kindGroupNm(),
                        req.codeKindId(), 0L));
            } else {
                CodeGroupRes ori = sysCodeGroupMapper.selectGroup(codeGroupId);
                if (ori == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                sysCodeGroupMapper.renameGroup(new CodeGroupRenameParam(req.codeKindId(), ori.kindGroupCd(),
                        ori.kindGroupNm(), req.kindGroupCd(), req.kindGroupNm()));
            }
            saved.add(sysCodeGroupMapper.selectGroup(codeGroupId));
        }
        return saved;
    }

    /**
     * AS-IS deleteAll L57-70: 행마다 (코드구분, 그룹코드, 그룹설명)이 같은 모든 행(소속 코드 포함)을 지우고, 이어서 ID로 지운다.
     * → 지운 그룹(헤더) 수
     */
    @Transactional
    public int deleteGroups(UserPrincipal user, List<Long> codeGroupIds) {
        requireSysAdmin(user);
        if (codeGroupIds == null || codeGroupIds.isEmpty()) {
            return 0;
        }
        int deleted = 0;
        for (Long id : codeGroupIds) {
            CodeGroupRes group = sysCodeGroupMapper.selectGroup(id);
            if (group == null) {
                continue;
            }
            sysCodeGroupMapper.deleteByKey(new CodeGroupKeyParam(group.codeKindId(), group.kindGroupCd(), group.kindGroupNm()));
            deleted++;
        }
        sysCodeGroupMapper.deleteByIds(codeGroupIds);
        return deleted;
    }

    // ── Sys13_TabPage_Code: 그룹에 속한 코드 ──

    /** AS-IS selectByKindGroupCode L34-42: 그룹의 코드, 코드의 회사 = 고른 회사 */
    public List<CodeGroupRes> searchMembers(UserPrincipal user, String kindGroupCd, Long codeKindId, Long companyId) {
        requireSysAdmin(user);
        return sysCodeGroupMapper.searchMembers(new CodeGroupMemberParam(kindGroupCd, codeKindId, user.companyOf(companyId)));
    }

    /**
     * AS-IS insert L44-55: 화면의 행마다 ID가 테이블에 없으면 INSERT. TOBE는 새 행만 받아 서버가 채번한다 → 넣은 건수.
     */
    @Transactional
    public int insertMembers(UserPrincipal user, List<CodeGroupMemberSaveReq> rows) {
        requireSysAdmin(user);
        int inserted = 0;
        for (CodeGroupMemberSaveReq req : rows) {
            sysCodeGroupMapper.insertGroup(new CodeGroupRow(sysCodeGroupMapper.selectNextId(), req.kindGroupCd(),
                    req.kindGroupNm(), req.codeKindId(), req.codeId()));
            inserted++;
        }
        return inserted;
    }

    /** AS-IS delete L93-96 (UpdateDataModel.deleteModel): ID로 삭제 → 지운 건수 */
    @Transactional
    public int deleteMembers(UserPrincipal user, List<Long> codeGroupIds) {
        requireSysAdmin(user);
        if (codeGroupIds == null || codeGroupIds.isEmpty()) {
            return 0;
        }
        return sysCodeGroupMapper.deleteByIds(codeGroupIds);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
