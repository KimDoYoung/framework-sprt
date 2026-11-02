package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ContentCond;
import kr.co.kfs.asseterp.biz.bbs.dto.ContentRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ContentSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsContentMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/bbs/Bbs31_Content.java (Z13 게시물) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsContentService {

    private final BbsContentMapper mapper;

    /** AS-IS selectByClassTreeIdPaging L40 — 검색어는 서비스가 %…%로 만든다(Bbs31_Grid_Content.retrieve L162-180) */
    public PageRes<ContentRes> searchPaging(UserPrincipal user, Long classTreeId, String searchText, long offset, long limit) {
        ContentCond cond = new ContentCond(user.getCompanyId(), classTreeId, user.getUserId(),
                "%" + (searchText == null ? "" : searchText) + "%", limit, offset);
        return new PageRes<>(mapper.selectByClassTreeIdPagingTotal(cond), mapper.selectByClassTreeIdPaging(cond));
    }

    /** AS-IS selectById L22 */
    public ContentRes get(UserPrincipal user, Long contentId) {
        ContentRes row = mapper.selectById(user.getCompanyId(), contentId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /** AS-IS selectByClassTreeId L28 / selectByParentTreeId L34 — 분류·세부항목을 지우기 전 "게시물이 있는가" (byParent = 분류 아래 모든 세부항목) */
    public boolean exists(UserPrincipal user, Long classTreeId, boolean byParent) {
        return (byParent ? mapper.countByParentTreeId(user.getCompanyId(), classTreeId) : mapper.countByClassTreeId(user.getCompanyId(), classTreeId)) > 0;
    }

    /** AS-IS Bbs31_Edit_Content.insert L68 — 파일을 붙이려고 화면이 새 글 ID를 먼저 받는다(DBUtil.setSeq) */
    @Transactional
    public Long nextId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS modelUpdate L58 — editChk가 false면 INSERT(등록자 = 로그인 사원, 등록일·시각 = 지금), true면 UPDATE(제목·내용·비공개만).
     * 수정은 작성자만 한다: 화면이 [수정]을 작성자에게만 보여 주는 규칙(Bbs31_Lookup_Content.open L95)을 서버도 같게 건다.
     * 필수 검사 문구는 Bbs31_Edit_Content.update L190
     */
    @Transactional
    public ContentRes save(UserPrincipal user, ContentSaveReq req) {
        if (req.title() == null || req.title().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "제목은 필수입력 항목입니다");
        }
        if (req.editChk()) {
            ContentRes old = get(user, req.contentId());
            requireWriter(user, old);
            mapper.updateContent(user.getCompanyId(), req.contentId(), req.title(), req.content(), req.hideYn());
        } else {
            if (req.classTreeId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "게시물 세부분류를 선택해주세요");
            }
            mapper.insertContent(user.getCompanyId(), user.getUserId(), req.contentId(), req.classTreeId(), req.title(), req.content(), req.hideYn());
        }
        return get(user, req.contentId());
    }

    /** AS-IS modelDelete L79 (작성자만 — 위와 같은 이유) */
    @Transactional
    public void delete(UserPrincipal user, Long contentId) {
        ContentRes old = get(user, contentId);
        requireWriter(user, old);
        mapper.deleteContent(user.getCompanyId(), contentId);
    }

    private static void requireWriter(UserPrincipal user, ContentRes row) {
        if (!user.getUserId().equals(row.personId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "작성자만 수정/삭제할 수 있습니다");
        }
    }
}
