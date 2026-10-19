package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateFundRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/Apr01_Appr.java selectByPaging L1170 (selectByDcrWrite) — 문서작성 목록 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprService {

    private final AprApprMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** 등록/결재선/열람권한에 내가 든 문서. searchText·receiveName은 서비스가 %…%로 만든다(빈 글자면 %%). classTreeId가 없으면 분류 조건 없음 */
    public PageRes<AprDcrWriteRes> searchDcrWrite(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText,
                                                  String receiveName, Long classTreeId, long offset, long limit) {
        AprDcrWriteCond cond = new AprDcrWriteCond(user.getCompanyId(), user.getUserId(), startDate, closeDate, "%",
                like(searchText), like(receiveName), classTreeId, limit, offset);
        return new PageRes<>(mapper.selectByDcrWriteTotal(cond), mapper.selectByDcrWritePaging(cond));
    }

    /**
     * AS-IS Apr01_Appr.selectByClassTreeId2 (F02, 이 메뉴는 admin=false). 내 조직이 열람할 수 있는 문서만(연관펀드·열람권한·Link 조건) + 내가 결재선·열람자인 문서.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. searchText는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<AprDocRes> searchDocList(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByClassTreeId2(new AprDocListCond(classTreeId, orgId, user.getUserId(), startDate, endDate, like(searchText)));
    }

    /**
     * AS-IS Apr03_RelateFund.selectByIcsClassTreeId (F03, 이 메뉴는 admin=false). 법규분류에 연결된 문서 중 내 조직이 열람할 수 있는 연관펀드만.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. searchText는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<AprIcsDocRes> searchIcsDocList(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByIcsClassTreeId(new AprIcsDocListCond(classTreeId, user.getCompanyId(), orgId, startDate, endDate, like(searchText)));
    }

    /** AS-IS Apr03_RelateFund.selectByApprId */
    public List<AprRelateFundRes> searchRelateFunds(Long apprId) {
        return mapper.selectRelateFunds(apprId);
    }

    /** AS-IS Apr12_RelateAdv.selectByApprId */
    public List<AprRelateAdvRes> searchRelateAdvs(Long apprId) {
        return mapper.selectRelateAdvs(apprId);
    }

    private String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}
