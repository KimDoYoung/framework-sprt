package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupKey;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeGroupSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeGroupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 공통코드 그룹 (AS-IS server/sys/Sys13_CodeGroup). 그룹 정의 행은 codeId 0, 구성 코드 행은 같은 그룹코드·설명 + codeId */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCodeGroupService {

    private final SysCodeGroupMapper sysCodeGroupMapper;

    /** AS-IS selectByGroupCodeKind */
    public List<CodeGroupRes> searchGroups(Long codeKindId) {
        return sysCodeGroupMapper.searchGroups(codeKindId);
    }

    /** AS-IS update: 기존 그룹은 같은 그룹의 모든 행 이름을 바꾸고 행을 UPDATE, 신규는 INSERT(codeId 0) */
    @Transactional
    public List<CodeGroupRes> updateGroups(List<CodeGroupSaveReq> rows) {
        List<CodeGroupRes> saved = new ArrayList<>(rows.size());
        for (CodeGroupSaveReq req : rows) {
            Long id;
            if (req.isNew()) {
                id = sysCodeGroupMapper.selectNextId();
                sysCodeGroupMapper.insert(CodeGroupRow.of(id, req));
            } else {
                id = req.codeGroupId();
                CodeGroupRes ori = sysCodeGroupMapper.selectById(id);
                if (ori != null) {
                    sysCodeGroupMapper.updateGroup(new CodeGroupKey(req.codeKindId(), req.kindGroupCd(), req.kindGroupNm(),
                            ori.kindGroupCd(), ori.kindGroupNm(), null));
                }
                sysCodeGroupMapper.update(CodeGroupRow.of(id, req));
            }
            saved.add(sysCodeGroupMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS deleteAll: 그룹(같은 코드·설명)의 모든 행을 지운다 */
    @Transactional
    public int deleteGroups(List<Long> codeGroupIds) {
        int count = 0;
        for (Long id : codeGroupIds) {
            CodeGroupRes g = sysCodeGroupMapper.selectById(id);
            if (g != null) {
                count += sysCodeGroupMapper.deleteGroup(new CodeGroupKey(g.codeKindId(), g.kindGroupCd(), g.kindGroupNm(), null, null, null));
            }
        }
        return count;
    }

    /** AS-IS selectByKindGroupCode: 그룹 구성 코드 (회사 코드) */
    public List<CodeGroupRes> searchGroupCodes(UserPrincipal user, Long codeKindId, String kindGroupCd, Long companyId) {
        return sysCodeGroupMapper.searchGroupCodes(new CodeGroupKey(codeKindId, kindGroupCd, null, null, null,
                SysCodeService.companyOf(user, companyId)));
    }

    /** AS-IS insert: 구성 코드 추가 (비고 = 그룹설명) */
    @Transactional
    public List<CodeGroupRes> createGroupCodes(List<CodeGroupSaveReq> rows) {
        List<CodeGroupRes> saved = new ArrayList<>(rows.size());
        for (CodeGroupSaveReq req : rows) {
            Long id = sysCodeGroupMapper.selectNextId();
            sysCodeGroupMapper.insert(CodeGroupRow.of(id, new CodeGroupSaveReq(id, req.kindGroupCd(), req.kindGroupNm(),
                    req.codeKindId(), req.codeId(), req.kindGroupNm())));
            saved.add(sysCodeGroupMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete: 구성 코드 행 삭제 */
    @Transactional
    public int deleteGroupCodes(List<Long> codeGroupIds) {
        return codeGroupIds == null || codeGroupIds.isEmpty() ? 0 : sysCodeGroupMapper.delete(codeGroupIds);
    }
}
