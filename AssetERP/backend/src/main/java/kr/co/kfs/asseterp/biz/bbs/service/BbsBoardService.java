package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsBoardRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsBoardSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsBoardMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS client/vi/bbs/Bbs01_Lookup_BoardInsert·BoardUpdate + server/bbs/Bbs01_Board — 게시판 글 등록·수정·삭제 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsBoardService {

    private final BbsBoardMapper mapper;

    /** AS-IS Bbs01_Tab_Board.retrieve → bbs.Bbs01_Board.selectByCompanyId(typeCode, title, companyId). 구분은 없으면 전체('%'), 제목은 %…% */
    public List<BbsBoardRes> search(UserPrincipal user, String typeCode, String title) {
        String type = (typeCode == null || typeCode.isBlank()) ? "%" : typeCode;
        return mapper.selectList(user.getCompanyId(), type, "%" + (title == null ? "" : title) + "%");
    }

    /** 수정 창을 열 때 읽는 글 (회사 것만) */
    public BbsBoardRes get(UserPrincipal user, Long boardId) {
        BbsBoardRes row = mapper.selectById(user.getCompanyId(), boardId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS Bbs01_Tab_Board.insertRow(DBUtil.setSeq): 새 글 번호 — 첨부파일을 글이 저장되기 전에 이 번호로 올린다 */
    @Transactional
    public Long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS bbs.Bbs01_Board.update(UpdateDataModel) — 있으면 고치고(회사 글만), 없으면 만든다(작성자 = 로그인 사원) */
    @Transactional
    public void save(UserPrincipal user, BbsBoardSaveReq req) {
        if (req == null || req.boardId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        if (mapper.update(user.getCompanyId(), req) > 0) return;
        mapper.insert(user.getCompanyId(), user.getUserId(), req);
    }

    /** AS-IS bbs.Bbs01_Board.delete */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        return mapper.delete(user.getCompanyId(), ids);
    }
}
