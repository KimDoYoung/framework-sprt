package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctPdfTarget;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckJobRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckJobSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgManagerRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckPreCreateRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRdPrintRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckStatusRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgForCheckRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckJobMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmDashboardMapper;
import kr.co.kfs.asseterp.biz.tdm.service.CheckExctPdfMaker.PdfOutcome;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 이행점검 작업 및 보고 (AS-IS Tdm50_Tab_CheckJob·Tdm50_TabPage_CheckJob·Tdm50_Edit_CheckJob, N20) → server/tdm/Tdm50_ChckJob·Tdm53_ChckExct·Tdm51_ChckOrg·Tdm56_ChckRelateAppr */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmCheckJobService {

    private final TdmCheckJobMapper mapper;
    private final TdmDashboardMapper dashboardMapper;
    private final CheckExctPdfMaker pdfMaker;
    private final CheckExctPdfSteps pdfSteps;

    /** AS-IS tdm.Tdm50_ChckJob.selectRcntChckJob — 진행 중인 점검년월(없으면 null → 화면은 현재월) */
    public String recentCheckYm(UserPrincipal user) {
        return dashboardMapper.selectRcntCheckYm(user.getCompanyId());
    }

    /** AS-IS tdm.Tdm50_ChckJob.selectByCheckYm (defaultYn=true) — 한 건 */
    public CheckJobRes search(UserPrincipal user, String checkYm) {
        return mapper.selectByCheckYm(user.getCompanyId(), checkYm);
    }

    /** AS-IS tdm.Tdm20_Role.getCeoRoleList */
    public List<CheckRoleRes> ceoRoles(UserPrincipal user, String checkYm, String baseDate) {
        return mapper.selectCeoRoles(user.getCompanyId(), checkYm, baseDate);
    }

    /** AS-IS tdm.Tdm50_ChckJob.modelUpdate — 새 작업이면 점검년월 이후 내역이 없어야 한다 */
    @Transactional
    public CheckJobRes save(UserPrincipal user, CheckJobSaveReq req) {
        CheckJobRes existing = req.chckJobId() == null ? null : mapper.selectById(req.chckJobId());
        if (existing == null) {
            if (mapper.countAfterCheckYm(user.getCompanyId(), req.checkYm()) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "점검년월 이후의 점검내역이 존재합니다.");
            }
            mapper.insertJob(req.chckJobId(), user.getCompanyId(), req.checkYm(), req.checkName(), req.startDate(), req.endDate(), user.getName());
        } else {
            requireOwn(user, existing);
            if (mapper.updateJob(req.chckJobId(), user.getCompanyId(), req.checkName(), req.startDate(), req.endDate(), user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return mapper.selectById(req.chckJobId());
    }

    /** AS-IS tdm.Tdm50_ChckJob.preCreateCheckManl */
    public CheckPreCreateRes preCreate(UserPrincipal user, Long chckJobId) {
        CheckJobRes job = requireJob(user, chckJobId);
        CheckStatusRes st = mapper.selectCheckStatus(user.getCompanyId(), job.checkYm());
        if (st == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이행점검 작업내용이 없습니다.");
        }
        if (!st.manlApprYn()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "미결재된 부서책무매뉴얼이 존재합니다. #1424 화면에서 결재상태를 확인하세요");
        }
        if (st.exctApprYn()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "승인이 완료된 임원이 존재합니다");
        }
        if (st.checkEndYn()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "완료 및 승인이 진행된 점검항목이 존재합니다");
        }
        if (st.checkIngYn()) {
            return new CheckPreCreateRes(2, "점검대기 및 진행중인 부서가 존재합니다.<br>진행시 작성중인 모든 데이터가 삭제됩니다. 진행하시겠습니까?");
        }
        return new CheckPreCreateRes(1, null);
    }

    /** AS-IS tdm.Tdm50_ChckJob.createCheckManl — 부서점검현황·점검항목·승인선(부서마다) → 임원승인현황 */
    @Transactional
    public void createCheckManl(UserPrincipal user, Long chckJobId) {
        CheckJobRes job = requireJob(user, chckJobId);
        if (job.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이행점검 작업정보(점검시작일, 점검마감일)를 입력하세요");
        }
        Long companyId = user.getCompanyId();
        String name = user.getName();
        String preCheckYm = mapper.selectPreCheckYm(companyId, job.checkYm());

        for (ManlOrgForCheckRes m : mapper.selectManlOrgByStdDate(companyId, job.startDate())) {
            Long chckOrgId = mapper.selectNextId();
            mapper.insertChckOrg(chckOrgId, companyId, job.checkYm(), m.roleId(), m.exctId(), m.orgId(), chckJobId, m.manlOrgId(), name);
            mapper.insertChckManl(chckOrgId, companyId, job.checkYm(), m.manlOrgId(), job.startDate(), preCheckYm, job.checkYm().substring(5), name);
            mapper.insertChckApprStep(chckOrgId, companyId, m.roleId(), m.orgId(), name);
        }
        mapper.insertChckExct(chckJobId, name);
    }

    /** AS-IS tdm.Tdm50_ChckJob.deleteChckManl */
    @Transactional
    public void deleteChckManl(UserPrincipal user, Long chckJobId) {
        CheckJobRes job = requireJob(user, chckJobId);
        mapper.deleteChckApprStep(user.getCompanyId(), job.checkYm());
        mapper.deleteChckExct(user.getCompanyId(), job.checkYm());
        mapper.deleteChckManl(user.getCompanyId(), job.checkYm());
        mapper.deleteChckOrg(user.getCompanyId(), job.checkYm());
    }

    /** AS-IS tdm.Tdm50_ChckJob.updateEndYn — 마감 전 잠금 점검(마감취소 때도 그대로 돈다) */
    @Transactional
    public void updateEndYn(UserPrincipal user, Long chckJobId, boolean endYn) {
        requireJob(user, chckJobId);
        if (mapper.countUnLockByExctAppr(chckJobId) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "잠금 처리가 필요한 승인 완료 임원이 존재합니다.");
        }
        if (mapper.countUnCheckByChckJobId(chckJobId) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "잠금 처리가 필요한 당월점검 내역이 존재합니다.");
        }
        mapper.updateEndYn(chckJobId, endYn, user.getName());
    }

    /** AS-IS tdm.Tdm51_ChckOrg.getMessageList — 알림발송 대상 부서담당자 */
    public List<CheckOrgManagerRes> messageTargets(UserPrincipal user, Long chckJobId, String baseDate) {
        CheckJobRes job = requireJob(user, chckJobId);
        return mapper.selectMessageList(user.getCompanyId(), job.checkYm(), baseDate, chckJobId);
    }

    /** AS-IS tdm.Tdm53_ChckExct.selectByChckJobId */
    public List<CheckExctRes> excts(UserPrincipal user, Long chckJobId, Long ceoRoleId) {
        requireJob(user, chckJobId);
        return mapper.selectExcts(chckJobId, ceoRoleId);
    }

    /** AS-IS tdm.Tdm51_ChckOrg.selectByRoleId (stdDate = 점검시작일) */
    public List<ChckOrgRes> orgs(UserPrincipal user, Long chckJobId, Long roleId) {
        CheckJobRes job = requireJob(user, chckJobId);
        return mapper.selectOrgsByRoleId(user.getCompanyId(), job.checkYm(), job.startDate(), roleId);
    }

    /** AS-IS tdm.Tdm53_ChckExct.updateLockYn — 로그인 회사 행만, 없으면 DATA_NOT_FOUND */
    @Transactional
    public void updateLock(UserPrincipal user, boolean isLock, List<Long> chckExctIds) {
        for (Long id : chckExctIds) {
            requireExctScope(user, id);
            if (mapper.updateLockYn(id, user.getCompanyId(), isLock, user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
    }

    /** AS-IS tdm.Tdm53_ChckExct.deleteList — 잠금해제 때 생성된 보고서 파일 행(관리자 파일) 삭제 */
    @Transactional
    public void deleteFiles(UserPrincipal user, List<Long> chckExctIds) {
        for (Long id : chckExctIds) {
            requireExctScope(user, id);
            mapper.deleteAdminFiles(id);
        }
    }

    /**
     * 한 건 PDF 생성 (AS-IS createRd: fileCheck → CreateTdmCheckJob → RD → checkFileStatus → fileReName).
     * 결과가 RD_FAILED면 화면이 잠금을 되돌리고 다음 건으로, FILE_FAILED면 멈춘다.
     */
    @Transactional
    public PdfOutcome recreate(UserPrincipal user, Long chckExctId) {
        Long companyId = requireExctScope(user, chckExctId);
        return pdfMaker.make(chckExctId, companyId, user);
    }

    /** AS-IS Sys99_Print.CreateTdmCheckJob (viewRd) — RD 뷰어가 읽을 출력 자료를 만들고 groupId와 보고서 매개값을 돌려준다 */
    public CheckRdPrintRes rdPrint(UserPrincipal user, Long chckExctId) {
        requireExctScope(user, chckExctId);
        CheckExctPdfTarget target = mapper.selectPdfTarget(chckExctId);
        Long groupId = pdfSteps.createPrintData(target);
        return new CheckRdPrintRes(groupId, RdCheckExctPdfMaker.yyyymm(target.checkYm()), target.roleName(), target.exctName());
    }

    /** AS-IS tdm.Tdm56_ChckRelateAppr.selectApprStatus — 없으면 null */
    public CheckApprRes apprStatus(UserPrincipal user, Long chckJobId, Long ceoRoleId) {
        requireJob(user, chckJobId);
        return mapper.selectApprStatus(chckJobId, ceoRoleId);
    }

    /** AS-IS tdm.Tdm56_ChckRelateAppr.selectByCeoRoleId */
    public List<CheckApprRes> apprs(UserPrincipal user, Long chckJobId, Long ceoRoleId) {
        requireJob(user, chckJobId);
        return mapper.selectApprs(chckJobId, ceoRoleId);
    }

    private CheckJobRes requireJob(UserPrincipal user, Long chckJobId) {
        CheckJobRes job = mapper.selectById(chckJobId);
        if (job == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        requireOwn(user, job);
        return job;
    }

    private static void requireOwn(UserPrincipal user, CheckJobRes job) {
        if (!job.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** 대상 행의 회사를 읽어 로그인 회사 행만 허용한다 */
    private Long requireExctScope(UserPrincipal user, Long chckExctId) {
        Long companyId = mapper.selectExctCompanyId(chckExctId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }
}
