package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprExtraMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** [오타수정] (AS-IS client/vi/apr/Apr01_Edit_ApprModi, server Apr01_Appr.modelUpdate·Apr92_ApprModi.selectByPersonId, V09) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprTypoService {

    private final AprApprExtraMapper mapper;
    private final AprApprDetailService detailService;
    private final AprApprActionService actionService;

    /** AS-IS apr.Apr92_ApprModi.selectByPersonId — personId가 없으면 로그인 사원. 기록이 없으면 null */
    public AprTypoRes getTypo(UserPrincipal user, Long apprId, Long personId) {
        detailService.getDetail(user, apprId);
        return mapper.selectTypo(apprId, personId == null ? user.getUserId() : personId);
    }

    /**
     * AS-IS Apr01_Edit_ApprModi.save L293-346 → apr.Apr01_Appr.modelUpdate L1284-1307: 이 사원의 오타수정 기록이 없으면 고치기 전 문서를 복사해 두고(변경사유 포함),
     * 있으면 사유·일시만 바꾼다(처음 복사한 내용은 그대로). 그다음 문서의 제목·수신·참조·비고·대표회사·대표서명·내용을 바꾼다.
     * 서버는 [오타수정] 단추가 켜지는 조건(내 차례인 결재·진행 문서)도 다시 검사한다(AS-IS는 단추만 막았다)
     */
    @Transactional
    public AprApprDetailRes save(UserPrincipal user, Long apprId, AprTypoSaveReq req) {
        AprApprDetailRes doc = detailService.getDetail(user, apprId);
        if (!actionService.canTypo(user, apprId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (blank(req.title())) {
            throw invalid("제목은 반드시 입력하셔야 합니다");
        }
        if (blank(req.reason())) {
            throw invalid("변경사유는 반드시 입력하셔야 합니다");
        }
        if (req.title().length() > 200) {
            throw invalid("상신제목 글자수가 초과되었습니다.(200자 제한)");
        }
        if ("10".equals(doc.inOutTypeCode()) && blank(req.receiveName())) {
            throw invalid("수신자는 필수입력 항목입니다");
        }
        if (blank(req.content())) {
            throw invalid("내용은 필수입력 항목입니다");
        }
        String content = req.content().replace("text-decoration-line", "text-decoration").replace("'", "\"");

        AprTypoRes mine = mapper.selectTypo(apprId, user.getUserId());
        if (mine == null) {
            mapper.insertTypoSnapshot(mapper.selectNextId(), apprId, user.getUserId(), req.reason());
        } else {
            mapper.updateTypoReason(mine.apprModiId(), req.reason());
        }
        mapper.updateApprTypo(apprId, user.getCompanyId(), req, content);
        return detailService.getDetail(user, apprId);
    }

    private static boolean blank(String s) {
        return s == null || s.isEmpty();
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
