package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCommentNoticeRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCommentRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprOpenHistoryCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprOpenHistoryRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprCommentMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/** 전자결재 문서창의 [열람기록]·[댓글] (AS-IS client/vi/apr/Apr41_Lookup_OpenHistory · Apr42_Lookup_Comment, V04) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprCommentService {

    private final AprApprCommentMapper mapper;
    private final AprApprDetailService detailService;
    private final AprNoticeMapper noticeMapper;

    /** AS-IS apr.Apr41_OpenHistory.selectByApprIdPaging(+Total) — 문서를 볼 수 있는 사원만 */
    public PageRes<AprOpenHistoryRes> searchOpenHistories(UserPrincipal user, Long apprId, long offset, long limit) {
        detailService.getDetail(user, apprId);
        AprOpenHistoryCond cond = new AprOpenHistoryCond(apprId, limit, offset);
        return new PageRes<>(mapper.selectOpenHistoryTotal(apprId), mapper.selectOpenHistoryPaging(cond));
    }

    /** AS-IS apr.Apr42_Comment.selectByApprId */
    public List<AprCommentRes> searchComments(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectComments(apprId, user.getCompanyId(), user.getUserId());
    }

    /** AS-IS apr.Apr42_Comment.modelUpdate — 내용이 비면 화면이 "내용을 입력해주세요"로 막는다(서버도 같은 검사) */
    @Transactional
    public void createComment(UserPrincipal user, Long apprId, String comment) {
        detailService.getDetail(user, apprId);
        if (comment == null || comment.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "내용을 입력해주세요");
        }
        mapper.insertComment(mapper.selectNextId(), user.getCompanyId(), user.getUserId(), apprId, comment);
    }

    /** AS-IS deleteChk L181-205 "작성자만 댓글을 삭제할 수 있습니다" → apr.Apr42_Comment.delete */
    @Transactional
    public void deleteComment(UserPrincipal user, Long apprId, Long commentId) {
        detailService.getDetail(user, apprId);
        AprCommentRes row = mapper.selectCommentById(commentId, apprId, user.getCompanyId());
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!Objects.equals(row.personId(), user.getUserId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "작성자만 댓글을 삭제할 수 있습니다");
        }
        mapper.deleteComment(commentId, user.getCompanyId());
    }

    /** AS-IS settings L106-117 · getApprStepList L150-171: 결재선 사원(apprEmpId)과 "'제목' 해당 문서에 댓글(첨부파일)이 추가되었습니다." + 접속 주소 */
    public AprCommentNoticeRes getNotice(UserPrincipal user, Long apprId) {
        AprApprDetailRes doc = detailService.getDetail(user, apprId);
        List<Long> personIds = detailService.getSteps(user, apprId).stream()
                .map(AprApprStepRes::apprEmpId)
                .filter(Objects::nonNull)
                .toList();
        String loc = noticeMapper.selectCompanyLoc(user.getCompanyId());
        String message = "'" + doc.title() + "' 해당 문서에 댓글(첨부파일)이 추가되었습니다." + "\r\n\r\n https://" + loc + ".k-fs.co.kr:5151/";
        return new AprCommentNoticeRes(personIds, message);
    }
}
