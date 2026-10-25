package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckBatchCompleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCheckerReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCompanySetup;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCompleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgBaseRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRecordParam;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckStatusReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckManlMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckOrgMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckRecordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 이행점검 항목 — 점검자 지정(AS-IS Tdm51_TabPage_CheckOrg, N21)과 이행점검 처리(Tdm52_Tab_CheckManl, N22) → server/tdm/Tdm52_ChckManl.
 * 점검 처리는 모두 점검항목이 속한 점검부서의 회사로 로그인 회사를 검사한다(AS-IS에는 없는 보강 — N21과 같다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmCheckManlService {

    private final TdmCheckManlMapper mapper;
    private final TdmCheckOrgMapper orgMapper;
    private final TdmChckRecordMapper recordMapper;
    private final SysFileService fileService;

    /** AS-IS tdm.Tdm52_ChckManl.selectByChckOrgId — searchText는 '%글자%'를 서버가 만든다 */
    public List<CheckManlRes> search(UserPrincipal user, Long chckOrgId, boolean unspecYn, String searchText) {
        requireOrg(user, chckOrgId);
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByChckOrgId(chckOrgId, unspecYn, like);
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateCheckerId — 로그인 회사 행만, 하나라도 없으면 DATA_NOT_FOUND */
    @Transactional
    public void updateChecker(UserPrincipal user, CheckCheckerReq req) {
        for (Long chckManlId : req.chckManlIds()) {
            if (mapper.updateCheckerId(chckManlId, user.getCompanyId(), req.personId(), user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
    }

    // ================= N22 이행점검 처리 =================

    /** AS-IS tdm.Tdm52_ChckManl.selectByPersonId — searchText는 글자가 있을 때만 '%글자%' (Tdm52_TabPage_CheckManl L103-124) */
    public List<CheckManlDetailRes> searchByPerson(UserPrincipal user, Long chckOrgId, Long personId, boolean undoneYn, String searchText) {
        requireOrg(user, chckOrgId);
        String like = searchText == null || searchText.trim().isEmpty() ? null : "%" + searchText + "%";
        return mapper.selectByPersonId(chckOrgId, personId, undoneYn, like);
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateCheckStatus — actionType P(점검시작: 점검대기→점검진행)·C(시작취소: 점검내역·조치계획·증빙을 지우고 점검대기). 점검이력(tdm55)의 처리자는 화면의 점검자 */
    @Transactional
    public void updateCheckStatus(UserPrincipal user, CheckStatusReq req) {
        CheckOrgBaseRes org = requireOrg(user, req.chckOrgId());
        String stdDate = orgMapper.selectCheckStartDate(org.chckJobId());
        String updName = user.getName();
        Long personId = req.personId();

        if ("P".equals(req.actionType())) {
            List<Long> targets = mapper.selectCheckTargetIds(org.chckOrgId(), personId, 1);
            if (targets.isEmpty()) {
                throw fail("점검 대기중인 점검항목이 없습니다");
            }
            for (Long chckManlId : targets) {
                // 점검상태(tdm52_check_status_cd) update : '점검대기(10)' => '점검진행(11)'
                orgMapper.updateCheckStatusById(chckManlId, "11", updName);
                record(org.companyId(), stdDate, chckManlId, "TDM52", "점검시작", personId, null, null);
            }
        } else if ("C".equals(req.actionType())) {
            List<Long> targets = mapper.selectCheckTargetIds(org.chckOrgId(), personId, 2);
            if (targets.isEmpty()) {
                throw fail("점검 진행중(또는 점검완료)인 점검항목이 없습니다");
            }
            for (Long chckManlId : targets) {
                // 1.미흡/개선 발생내역(tdm54) delete
                mapper.deleteInsuffByChckManlId(chckManlId);
                // 2.증빙자료 제거
                deleteEvidence(chckManlId);
                // 3.점검상태 update : '점검진행(11), 점검완료(19)' => '점검대기(10)'
                mapper.updateByChckManlId(chckManlId, null, null, null, "10", updName);
                // 4.점검이력 생성(tdm55)
                record(org.companyId(), stdDate, chckManlId, "TDM52", "점검시작취소", personId, null, null);
            }
        } else {
            throw fail("정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요 [" + req.actionType() + "]");
        }
    }

    /** AS-IS tdm.Tdm52_ChckManl.modelUpdate — 점검일자·점검결과·점검의견 저장. 의견 글자수 제한(tdm91)을 검사한다. 응답은 다시 읽은 점검항목 */
    @Transactional
    public CheckManlDetailRes update(UserPrincipal user, Long chckManlId, CheckManlSaveReq req) {
        CheckManlDetailRes manl = requireManl(user, chckManlId);
        checkCmntLimit(manl.companyId(), req.checkDate(), req.checkCmnt());
        mapper.updateContent(chckManlId, manl.companyId(), req.checkDate(), req.checkResultCode(), req.checkCmnt(), user.getName());
        return mapper.selectById(chckManlId);
    }

    /**
     * AS-IS tdm.Tdm52_ChckManl.updateComplete — actionType P(점검완료)·C(점검완료취소).
     * 상태 판단은 서버가 읽은 점검항목으로 한다(AS-IS C는 화면이 보낸 상태를 썼다). 응답은 다시 읽은 점검항목
     */
    @Transactional
    public CheckManlDetailRes updateComplete(UserPrincipal user, Long chckManlId, CheckCompleteReq req) {
        CheckManlDetailRes manl = requireManl(user, chckManlId);
        String stdDate = orgMapper.selectCheckStartDate(manl.chckJobId());
        String updName = user.getName();

        // 처리전 체크
        if ("20".equals(manl.checkStatusCode())) {
            throw fail("승인 요청 상태입니다");
        } else if ("21".equals(manl.checkStatusCode())) {
            throw fail("승인 진행 중입니다");
        } else if ("25".equals(manl.checkStatusCode())) {
            throw fail("승인이 완료되었습니다");
        }

        String procType;
        String procResult;
        String resultCmnt;
        if ("P".equals(req.actionType())) {
            procType = "점검완료";
            procResult = req.checkResultName();
            resultCmnt = req.checkCmnt();

            if ("1".equals(req.checkResultCode())) { // (1:적정)인 경우
                // 증빙파일 필수등록 체크여부가 'true'이면 증빙자료 필수
                CheckCompanySetup setup = mapper.selectCompanySetupByDate(manl.companyId(), stdDate);
                if (setup == null || Boolean.TRUE.equals(setup.evidFileCheckYn())) {
                    if (mapper.countEvidFile(chckManlId) == 0) {
                        throw fail("증빙자료가 존재하지 않습니다");
                    }
                }
                // 체크의견 글자수 체크
                checkCmntLimit(manl.companyId(), req.checkDate(), req.checkCmnt());
            }

            List<Long> insuffIds = mapper.selectInsuffIds(chckManlId);
            // 점검결과가 (2:미흡 /3:개선)인 경우 조치계획(tdm54) 필수
            if ("2".equals(req.checkResultCode()) || "3".equals(req.checkResultCode())) {
                if (insuffIds.isEmpty()) {
                    throw fail("조치계획을 등록하세요");
                }
            } else if (!insuffIds.isEmpty()) {
                // 점검결과가 (1:적정 /9:해당없음)인데 조치계획이 존재하면 삭제
                mapper.deleteInsuffById(insuffIds.get(0));
            }
            mapper.updateByChckManlId(chckManlId, req.checkDate(), req.checkResultCode(), req.checkCmnt(), "19", updName);
        } else if ("C".equals(req.actionType())) {
            procType = "점검완료취소";
            procResult = manl.checkResultName();
            resultCmnt = manl.checkCmnt();

            if (!"19".equals(manl.checkStatusCode())) { // 점검완료(19)가 아닌 경우
                if ("26".equals(manl.checkStatusCode())) {
                    // 승인반려(26)인 경우 부서장의 승인상태(tdm59)가 '반려(30)'인 경우에만 완료취소가 가능하다
                    if (!"30".equals(mapper.selectApprStatusCode(chckManlId))) {
                        throw fail("부서장의 반려 승인이 확인되지 않아 취소할 수 없습니다");
                    }
                } else {
                    throw fail("점검상태가 '점검완료,승인반려'인 경우에만 취소할 수 있습니다");
                }
            }
            // 조치계획 승인선(tdm61) 제거
            mapper.deleteInsuffApprByChckManlId(chckManlId);
            // (11:점검진행) SET — 점검일·결과·의견은 그대로
            mapper.updateByChckManlId(chckManlId, manl.checkDate(), manl.checkResultCode(), manl.checkCmnt(), "11", updName);
        } else {
            throw fail("정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요 [" + req.actionType() + "]");
        }

        // 점검이력 생성(tdm55)
        record(manl.companyId(), stdDate, chckManlId, "TDM52", procType, user.getUserId(), procResult, resultCmnt);
        return mapper.selectById(chckManlId);
    }

    /** AS-IS tdm.Tdm52_ChckManl.batchCheckComplete — 고른 점검항목을 한 트랜잭션으로 점검완료. 증빙 복사(연결문서·업로드·외부보관)는 증빙자료 창과 같이 다음 단계 */
    @Transactional
    public void batchComplete(UserPrincipal user, CheckBatchCompleteReq req) {
        List<Long> ids = req.chckManlIds();
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String stdDate = null;
        for (Long chckManlId : ids) {
            CheckManlDetailRes manl = requireManl(user, chckManlId);
            if (stdDate == null) {
                stdDate = orgMapper.selectCheckStartDate(manl.chckJobId());
            }
            // 조치계획이 존재하는 경우 조치계획 삭제
            List<Long> insuffIds = mapper.selectInsuffIds(chckManlId);
            if (!insuffIds.isEmpty()) {
                mapper.deleteInsuffById(insuffIds.get(0));
            }
            // (19:점검완료) SET
            mapper.updateByChckManlId(chckManlId, req.checkDate(), req.checkResultCode(), req.checkCmnt(), "19", user.getName());
            // 점검이력 생성(tdm55)
            record(manl.companyId(), stdDate, chckManlId, "TDM52", "점검완료", user.getUserId(), req.checkResultName(), req.checkCmnt());
        }
    }

    /** AS-IS tdm.Tdm52_ChckManl.batchCancelComplete — 고른 점검항목의 점검완료를 취소(증빙 제거, 점검진행으로). 이력의 의견은 AS-IS 그대로 null */
    @Transactional
    public void batchCancel(UserPrincipal user, List<Long> chckManlIds) {
        if (chckManlIds == null || chckManlIds.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String stdDate = null;
        for (Long chckManlId : chckManlIds) {
            CheckManlDetailRes manl = requireManl(user, chckManlId);
            if (stdDate == null) {
                stdDate = orgMapper.selectCheckStartDate(manl.chckJobId());
            }
            // 증빙자료 제거
            deleteEvidence(chckManlId);
            // (11:점검진행) SET
            mapper.updateByChckManlId(chckManlId, null, null, null, "11", user.getName());
            // 점검이력 생성(tdm55)
            record(manl.companyId(), stdDate, chckManlId, "TDM52", "점검완료취소", user.getUserId(), manl.checkResultName(), null);
        }
    }

    /** 증빙자료 제거 — 1.연결문서 2.업로드 파일(실제 파일 포함) 3.외부보관 증빙자료 (AS-IS 순서 그대로) */
    private void deleteEvidence(Long chckManlId) {
        mapper.deleteRelateApprByKeyTableId(chckManlId);
        for (Long fileId : mapper.selectOwnedFileIds(chckManlId)) {
            fileService.delete(fileId);
        }
        mapper.deleteEvidExtrByTargetId(chckManlId);
    }

    /** AS-IS Tdm91_CompanySetup.checkCmntLimit — 설정이 없거나 최소 글자수가 없거나 0이면 검사 안 함 */
    public void checkCmntLimit(Long companyId, String stdDate, String cmnt) {
        if (companyId == null) {
            throw fail("의견 체크 중 오류발생. 관리자에게 문의해주세요 (회사ID 확인필요)");
        }
        if (stdDate == null) {
            throw fail("의견 체크 중 오류발생. 관리자에게 문의해주세요 (기준일자 확인필요)");
        }
        CheckCompanySetup setup = mapper.selectCompanySetupByDate(companyId, stdDate);
        if (setup == null || setup.cmntMinLimit() == null || setup.cmntMinLimit() == 0) {
            return;
        }
        int len = cmnt == null ? 0 : cmnt.length();
        if (len < setup.cmntMinLimit()) {
            throw fail("의견은 " + setup.cmntMinLimit() + "자 이상 입력해주세요");
        }
    }

    private void record(Long companyId, String stdDate, Long relateTableId, String relateTable, String procType, Long personId,
                        String procResult, String resultCmnt) {
        recordMapper.insertRecord(new CheckRecordParam(companyId, stdDate, relateTableId, relateTable, procType, personId, procResult, resultCmnt, null));
    }

    private CheckOrgBaseRes requireOrg(UserPrincipal user, Long chckOrgId) {
        CheckOrgBaseRes org = orgMapper.selectById(chckOrgId);
        if (org == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!org.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return org;
    }

    /** 점검항목을 읽고 로그인 회사 것인지 검사 — 조치계획 서비스도 쓴다 */
    public CheckManlDetailRes requireManl(UserPrincipal user, Long chckManlId) {
        CheckManlDetailRes manl = mapper.selectById(chckManlId);
        if (manl == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!manl.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return manl;
    }

    /** AS-IS result.fail(-1, 메시지) — 화면이 그 문구를 그대로 보여 준다 */
    private static BusinessException fail(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
