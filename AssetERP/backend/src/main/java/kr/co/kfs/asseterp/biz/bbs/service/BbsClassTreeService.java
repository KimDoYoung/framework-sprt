package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsClassTreeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/bbs/Bbs30_ClassTree.java (Z13 게시판 분류/세부항목) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsClassTreeService {

    private final BbsClassTreeMapper mapper;

    /** AS-IS selectByRoleUserTypeCode L52 — 왼쪽 목록(typeCode 'T'). 내 조직(부서장 소속)은 로그인 토큰의 deptId */
    public List<ClassTreeRes> searchMine(UserPrincipal user) {
        return mapper.selectByRoleUserTypeCode(user.getCompanyId(), orgId(user), user.getUserId(), "T");
    }

    /** AS-IS selectByTypeCode L30 (관리 창 왼쪽 'C') / selectByParentTreeId L65 (오른쪽 'T', 상위 분류가 없으면 빈 목록 — SQL의 `= NULL`) */
    public List<ClassTreeRes> search(UserPrincipal user, String typeCode, Long parentTreeId) {
        if ("C".equals(typeCode) || parentTreeId == null && !"T".equals(typeCode)) {
            return mapper.selectByTypeCode(user.getCompanyId(), typeCode);
        }
        return parentTreeId == null ? List.of() : mapper.selectByParentTreeId(user.getCompanyId(), typeCode, parentTreeId);
    }

    /**
     * AS-IS update L99 — UpdateDataModel: 새 줄(ID 없음·0 이하)은 getSeq 채번 INSERT, 그 밖은 UPDATE. 저장한 줄을 selectById로 다시 읽어 돌려준다(요청과 같은 순서).
     * 필수 검사 문구는 Bbs30_Lookup_ClassTree.update01 L286 / update02 L388
     */
    @Transactional
    public List<ClassTreeRes> save(UserPrincipal user, List<ClassTreeSaveReq> rows) {
        List<ClassTreeRes> saved = new ArrayList<>();
        for (ClassTreeSaveReq r : rows) {
            boolean detail = "T".equals(r.typeCd());
            if (r.classTreeNm() == null || r.classTreeNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, detail ? "게시물 세부항목명은 필수입력 항목입니다" : "게시물 분류명은 필수입력 항목입니다");
            }
            if (detail && r.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "순서는 필수입력 항목입니다");
            }
            Long id = r.classTreeId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertClassTree(user.getCompanyId(), id, r);
            } else {
                mapper.updateClassTree(user.getCompanyId(), r);
            }
            saved.add(mapper.selectById(user.getCompanyId(), id));
        }
        return saved;
    }

    /** AS-IS delete L104 (선택한 줄 하나). 아래 게시물 유무는 화면이 먼저 묻는다(contents/exists) — AS-IS도 서버는 검사하지 않는다 */
    @Transactional
    public int delete(UserPrincipal user, Long classTreeId) {
        return mapper.deleteClassTree(user.getCompanyId(), classTreeId);
    }

    /** AS-IS updateParentTreeId L77 — [이동] */
    @Transactional
    public void updateParentTreeId(UserPrincipal user, Long classTreeId, Long parentTreeId) {
        mapper.updateParentTreeId(user.getCompanyId(), classTreeId, parentTreeId);
    }

    /** AS-IS updatePublicYn L88 — 권한을 저장하면 전체공개를 끈다 */
    @Transactional
    public void updatePublicYn(UserPrincipal user, Long classTreeId, boolean publicYn) {
        mapper.updatePublicYn(user.getCompanyId(), classTreeId, publicYn);
    }

    static Long orgId(UserPrincipal user) {
        try {
            return user.getDeptId() == null ? -1L : Long.valueOf(user.getDeptId());
        } catch (NumberFormatException e) {
            return -1L;
        }
    }
}
