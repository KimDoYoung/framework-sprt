package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.BizShareRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BizShareSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsBizShareMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/bbs/Bbs10_BizShare.java (Z07 업무공유) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsBizShareService {

    private final BbsBizShareMapper mapper;

    /** AS-IS selectByText L26 — 구분 없으면 전부('%'), 검색어는 '%…%' (Bbs10_Tab_BizShare.retrieve L192-215) */
    public List<BizShareRes> searchByText(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String bizShareType, String searchText) {
        String type = (bizShareType == null || bizShareType.isBlank()) ? "%" : bizShareType;
        return mapper.selectByText(user.getCompanyId(), startDate, closeDate, type, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS modelUpdate L39 — ID가 없으면 getSeq로 채번해 INSERT(등록자 = 로그인 사원), 있으면 UPDATE 뒤 selectById로 다시 읽는다.
     * 수정 창은 관리자·남의 글이면 구분·업무내용 칸을 잠근다(Bbs10_Edit_BizShare.edit L71-76) → 서버도 그 두 값은 원래 값을 쓴다.
     */
    @Transactional
    public BizShareRes save(UserPrincipal user, BizShareSaveReq req) {
        // Bbs10_Edit_BizShare.update L151-166
        if (req.date() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록일은 필수입력 항목입니다");
        }
        if (req.bizShareType() == null || req.bizShareType().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "구분은 필수선택 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "업무내용은 필수작성 항목입니다");
        }
        if (req.keyword() != null && req.keyword().length() > 30) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "키워드는 최대 30자까지만 입력하세요 (현재:" + req.keyword().length() + "자리)");
        }
        Long id = req.bizShareId();
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertShare(user.getCompanyId(), user.getUserId(), id, req);
        } else {
            BizShareRes old = mapper.selectById(user.getCompanyId(), id);
            if (old == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            BizShareSaveReq use = req;
            if (locked(user, old)) {
                use = new BizShareSaveReq(id, req.date(), old.bizShareType(), old.content(), req.keyword(), req.note());
            }
            mapper.updateShare(user.getCompanyId(), use);
        }
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS delete L57 + 화면 검사(Bbs10_Tab_BizShare.deleteRow L227-242): 관리자이거나 남의 글이면 "등록자만 삭제가능합니다." */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            BizShareRes row = mapper.selectById(user.getCompanyId(), id);
            if (row == null) {
                continue;
            }
            if (locked(user, row)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "등록자만 삭제가능합니다.");
            }
            count += mapper.deleteShare(user.getCompanyId(), id);
        }
        return count;
    }

    /** LoginUser.getIsManager()(회사관리자 = 세션 사용자 ID 음수) 이거나 등록자가 내가 아니다 */
    private boolean locked(UserPrincipal user, BizShareRes row) {
        return user.getUserId() < 0 || !user.getUserId().equals(row.personId());
    }
}
