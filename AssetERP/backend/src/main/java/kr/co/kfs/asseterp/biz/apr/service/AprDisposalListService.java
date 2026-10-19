package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalApprCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprDisposalListMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/** AS-IS server/apr/Apr90_DisposalList.java selectByPersonId L43 (Apr90_Tab_DisposalList), selectByCompanyId L38·updateAppr L81 (Apr90_Tab_DisposalAppr) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprDisposalListService {

    private final AprDisposalListMapper mapper;

    /** 로그인 사용자가 신청한 폐기문서 (신청일 기간). personId는 서버가 세션에서(원본 LoginUser.getUserId()) */
    public List<AprDisposalListRes> searchByPerson(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectByPersonId(new AprDisposalListCond(user.getUserId(), startDate, closeDate));
    }

    /** AS-IS selectByCompanyId L38. 화면이 늘 로그인 사용자 id를 confirmEmpId로 보내므로 내게 지정된 승인 건만 나온다. 처리상태 빈 값은 '%'(전체) */
    public List<AprDisposalApprRes> searchByCompany(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String disposalCode) {
        String code = disposalCode == null || disposalCode.isBlank() ? "%" : disposalCode;
        return mapper.selectByCompanyId(new AprDisposalApprCond(user.getCompanyId(), startDate, closeDate, code, user.getUserId()));
    }

    /** AS-IS updateAppr L81: 승인(20)·반려(99). 승인이면 문서를 apr99로 옮기고 삭제하며 연결(작성·계획·광고도서)을 푼다 */
    @Transactional
    public void updateDisposalCode(UserPrincipal user, String disposalCode, List<Long> disposalListIds) {
        if (!"20".equals(disposalCode) && !"99".equals(disposalCode)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String confirmYn = "99".equals(disposalCode) ? "false" : "true";
        LocalDateTime now = LocalDateTime.now();
        for (Long disposalListId : disposalListIds) {
            Long apprId = mapper.selectApprId(user.getCompanyId(), disposalListId);
            if (apprId == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            mapper.updateDisposalCode(disposalListId, disposalCode, user.getUserId(), now, confirmYn);
            mapper.insertHistory(user.getCompanyId(), user.getUserId(), now, apprId, disposalCode);
            if ("20".equals(disposalCode)) {
                mapper.insertApprDel(apprId, user.getUserId());
                mapper.deleteAppr(apprId);
                mapper.clearOprCreateAppr(apprId);
                mapper.clearPlanAppr(apprId);
                mapper.deleteAdvertBook(apprId);
            }
        }
    }
}
