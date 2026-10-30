package kr.co.kfs.asseterp.biz.apr.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStampApplRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprEmpBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateLawRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprDetailMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/** 전자결재 문서 열기 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc.retrieveApproval + Apr03_Page_Relate.retrieve, V01) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprDetailService {

    private final AprApprDetailMapper mapper;

    /** AS-IS apr.Apr01_Appr.selectById — 로그인 회사의 문서만(AS-IS는 회사 조건이 없다). 제목은 앞뒤 공백을 자른다(getAppr L828-830) */
    public AprApprDetailRes getDetail(UserPrincipal user, Long apprId) {
        AprApprDetailRes d = mapper.selectDetail(apprId, user.getCompanyId());
        if (d == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return new AprApprDetailRes(d.apprId(), d.companyId(), d.classTreeId(), d.classTreeFullName(), d.printFundYn(),
                d.title() == null ? null : d.title().trim(), d.inOutTypeCode(), d.content(), d.regDate(), d.effectDate(), d.statusCode(),
                d.regEmpId(), d.regEmpName(), d.stampId(), d.stampName(), d.stampPosition(), d.stampPositionName(), d.receiveName(),
                d.referenceName(), d.signCompany(), d.signCeo(), d.note(), d.linkCode(), d.advertYn());
    }

    /**
     * AS-IS apr.Apr04_ApprStep.selectByApprId (server/apr/Apr04_ApprStep.java L69-343). 결재자 문구(stepApprName)를 서버가 만든다:
     * 결재 완료(20)인데 실결재자가 다르면 부)·대결)/본결), 아니면 대결자(apr07)·인감 (부)책임자 규칙. 문서 열기에 쓰는 baseDate는 문서의 상신일.
     */
    public List<AprApprStepRes> getSteps(UserPrincipal user, Long apprId) {
        AprApprDetailRes doc = getDetail(user, apprId);
        LocalDate regDate = doc.regDate().toLocalDate();
        List<AprApprStepRow> rows = mapper.selectSteps(apprId);
        List<AprApprStepRes> out = new ArrayList<>();
        Long firstOrgId = rows.isEmpty() ? 0L : rows.get(0).orgCodeId();
        for (AprApprStepRow r : rows) {
            AprAltRow alt = mapper.selectAltCount(r.stepEmpId()) != 1
                    ? mapper.selectAltByOrg(r.stepEmpId(), firstOrgId)
                    : mapper.selectAltByEmp(r.stepEmpId());
            String name = null;
            Long apprEmpId = r.apprEmpId();
            String own = text(r.titleName(), r.korName(), r.orgTitleName());
            String type = r.stepTypeCode();
            if ("20".equals(r.stepStatusCode())) {
                if (!String.valueOf(r.stepEmpId()).equals(String.valueOf(apprEmpId == null ? 0L : apprEmpId))) {
                    if (apprEmpId != null) {
                        LocalDate base = r.apprDate().toLocalDate();
                        AprEmpBrief real = mapper.selectEmpBrief(apprEmpId, base);
                        AprEmpBrief origin = mapper.selectEmpBrief(r.stepEmpId(), base);
                        if ("40".equals(type)) {
                            name = "<b>부) </b>" + real.korName() + "(" + real.orgName() + ")";
                        } else if ("30".equals(type)) {
                            name = text(real.titleName(), real.korName(), real.orgName());
                        } else {
                            name = "<b>대결) </b>" + text(real.titleName(), real.korName(), real.orgName())
                                    + "<br><br><b>본결) </b>" + text(origin.titleName(), origin.korName(), origin.orgName());
                        }
                    }
                } else {
                    // AS-IS: 단계코드 40의 "정) " 문구를 붙인 뒤 곧바로 덮어써서 직책 성명(조직)만 남는다
                    name = own;
                    apprEmpId = r.stepEmpId();
                }
            } else if (alt != null) {
                if ("40".equals(type)) {
                    if ("true".equals(alt.stampYn())) {
                        Long second = mapper.selectStampSecondEmp(apprId, r.stepEmpId());
                        if (second != null && !Objects.equals(r.stepEmpId(), second)) {
                            AprEmpBrief sec = mapper.selectEmpBrief(second, regDate);
                            name = "<b>부) </b>" + text(sec.titleName(), sec.korName(), sec.orgName());
                            apprEmpId = second;
                        } else {
                            name = "<b>정) </b>" + own;
                            apprEmpId = r.stepEmpId();
                        }
                    } else {
                        name = "<b>정) </b>" + own;
                        apprEmpId = r.stepEmpId();
                    }
                } else if ("00".equals(type) || "30".equals(type)) {
                    name = own;
                    apprEmpId = r.stepEmpId();
                } else {
                    apprEmpId = alt.altEmpId();
                    name = "<b>대결) </b>" + text(alt.altTitleName(), alt.altEmpName(), alt.altOrgName())
                            + "<br><br><b>본결) </b>" + text(alt.targetTitleName(), alt.targetEmpName(), alt.targetOrgName());
                }
            } else {
                name = ("40".equals(type) ? "<b>정) </b>" : "") + own;
                apprEmpId = r.stepEmpId();
            }
            out.add(new AprApprStepRes(r.apprStepId(), r.seq(), type, r.stepTypeName(), r.stepStatusCode(), r.stepStatusName(), r.apprDate(), name,
                    r.opinionYnStr(), r.typoYnStr(), r.note(), r.rejectReason(), r.stepEmpId(), apprEmpId));
        }
        return out;
    }

    /** AS-IS apr.Apr03_RelateFund.selectByApprId */
    public List<AprApprFundRes> getFunds(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.selectApprFunds(apprId);
    }

    /** AS-IS apr.Apr12_RelateAdv.selectByApprId */
    public List<AprApprAdvRes> getAdvs(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.selectApprAdvs(apprId);
    }

    /** AS-IS apr.Apr21_RelateAppr.selectByApprId */
    public List<AprRelateApprRes> getRelateApprs(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.selectRelateApprs(apprId);
    }

    /** AS-IS apr.Apr20_RelateIcs.selectByApprId */
    public List<AprRelateLawRes> getRelateIcs(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.selectRelateIcs(apprId);
    }

    /** AS-IS apr.Apr22_RelateIcr.selectByApprId */
    public List<AprRelateLawRes> getRelateIcr(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.selectRelateIcr(apprId);
    }

    /** AS-IS apr.Apr16_StampDoc.selectByApprId — 날인신청 탭 */
    public List<AprApprStampApplRes> getStampAppls(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.selectStampAppls(apprId);
    }

    /** AS-IS sys.Sys10_File.selectByParentId (첨부파일 탭) */
    public List<AprApprFileRes> getFiles(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.selectApprFiles(apprId);
    }

    /** AS-IS apr.Apr50_Bookmark.selectByPublicYn(publicYn=true) — 행이 있으면 북마크 켜짐(getApprBookmark L562-580) */
    public boolean isBookmarked(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.countBookmark(apprId, user.getCompanyId(), user.getUserId()) > 0;
    }

    /** AS-IS apr.Apr42_Comment.getSize */
    public int getCommentSize(UserPrincipal user, Long apprId) {
        getDetail(user, apprId);
        return mapper.countComments(apprId, user.getCompanyId());
    }

    /** AS-IS getApprModel L544-548: 임시저장(99)이 아니고 관리자가 아니면 열람기록을 남긴다 */
    @Transactional
    public void recordOpen(UserPrincipal user, Long apprId) {
        AprApprDetailRes doc = getDetail(user, apprId);
        if ("99".equals(doc.statusCode()) || SysMenuSearchService.isManager(user)) {
            return;
        }
        mapper.insertOpenHistory(user.getCompanyId(), user.getUserId(), apprId);
    }

    private static String text(String title, String name, String org) {
        return (title == null ? "" : title) + " " + name + "(" + org + ")";
    }
}
