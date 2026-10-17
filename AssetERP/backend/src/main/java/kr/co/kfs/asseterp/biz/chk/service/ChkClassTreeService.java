package kr.co.kfs.asseterp.biz.chk.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.chk.dto.ChkClassTreeRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.chk.mapper.ChkClassTreeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * AS-IS Chk01_Tab_ClassTree·Chk01_Edit_ClassTree → server/chk/Chk01_ClassTree.java (selectByAll L30 / update L90 / delete L95).
 * 조회는 원본 그대로 회사 구분 없이 전체 트리, 저장·삭제는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChkClassTreeService {

    private final ChkClassTreeMapper mapper;

    /** AS-IS selectByAll: 루트(상위 0)부터 selectByParentId를 아래로 되풀이 → 전위 순서 평평한 목록 */
    public List<ChkClassTreeRes> searchTree() {
        List<ChkClassTreeRes> out = new ArrayList<>();
        addChildren(out, 0L, 0, new HashSet<>());
        return out;
    }

    private void addChildren(List<ChkClassTreeRes> out, Long parentTreeId, int depth, Set<Long> seen) {
        for (ChkClassTreeRes r : mapper.selectByParentId(parentTreeId)) {
            if (!seen.add(r.classTreeId())) continue;
            out.add(new ChkClassTreeRes(r.classTreeId(), r.companyId(), r.parentTreeId(), r.classTreeName(), r.seq(),
                    r.useYn(), r.note(), r.linkCode(), r.linkName(), depth));
            addChildren(out, r.classTreeId(), depth + 1, seen);
        }
    }

    /** AS-IS Chk01_ClassTree.selectByLinkCode (E07): 링크코드 분류 한 건, 없으면 null */
    public ChkClassTreeRes getByLinkCode(String linkCode) {
        return mapper.selectByLinkCode(linkCode);
    }

    /** AS-IS Chk01_ClassTree.selectByCompanyId (E07): 기준 분류(기본 0)의 아래 전체를 getChildByCompanyId 되풀이로 → 전위 평평한 목록(depth) */
    public List<ChkClassTreeRes> searchTreeByCompany(UserPrincipal user, Long parentTreeId) {
        List<ChkClassTreeRes> out = new ArrayList<>();
        addCompanyChildren(out, user.getCompanyId(), parentTreeId == null ? 0L : parentTreeId, 0, new HashSet<>());
        return out;
    }

    private void addCompanyChildren(List<ChkClassTreeRes> out, Long companyId, Long parentTreeId, int depth, Set<Long> seen) {
        for (ChkClassTreeRes r : mapper.selectByCompanyId(companyId, parentTreeId)) {
            if (!seen.add(r.classTreeId())) continue;
            out.add(new ChkClassTreeRes(r.classTreeId(), r.companyId(), r.parentTreeId(), r.classTreeName(), r.seq(),
                    r.useYn(), r.note(), r.linkCode(), r.linkName(), depth));
            addCompanyChildren(out, companyId, r.classTreeId(), depth + 1, seen);
        }
    }

    /** AS-IS update(UpdateDataModel) 새 분류: id는 원본이 열기 전에 받던 getSeq — 저장 때 채번. → 저장된 행 */
    @Transactional
    public ChkClassTreeRes create(UserPrincipal user, ChkClassTreeSaveReq req) {
        long id = mapper.selectNextId();
        mapper.insert(user.getCompanyId(), id, req);
        return mapper.selectById(id);
    }

    /** AS-IS update(UpdateDataModel) 수정 → 저장된 행. 로그인 회사 행이 아니면 없는 분류로 본다 */
    @Transactional
    public ChkClassTreeRes update(UserPrincipal user, Long classTreeId, ChkClassTreeSaveReq req) {
        if (mapper.update(user.getCompanyId(), classTreeId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(classTreeId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel): 그 분류 한 건만(하위 분류는 원본도 그대로 둔다) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long classTreeId) {
        return mapper.deleteById(user.getCompanyId(), classTreeId);
    }
}
