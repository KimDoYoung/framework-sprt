package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprCmntRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckInsuffTarget;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgBaseRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgStatusRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRecordParam;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckOrgMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckRecordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 업무점검자 지정 및 승인요청 — 부서 점검현황 (AS-IS Tdm51_Tab_CheckOrg·Tdm51_TabPage_CheckOrg, N21) → server/tdm/Tdm51_ChckOrg */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmCheckOrgService {

    private final TdmCheckOrgMapper mapper;
    private final TdmChckRecordMapper recordMapper;

    /** AS-IS tdm.Tdm51_ChckOrg.selectByOrgId (companyId는 로그인 회사). personId는 N22(점검자 기준)만 준다 */
    public List<CheckOrgStatusRes> search(UserPrincipal user, String checkYm, Long orgId, Long personId) {
        return mapper.selectByOrgId(user.getCompanyId(), checkYm, orgId, personId);
    }

    /** AS-IS tdm.Tdm51_ChckOrg.updateFix — actionType P(확정)·C(확정취소). 실패 사유는 AS-IS 문구 그대로 던진다(전체 롤백) */
    @Transactional
    public void updateFix(UserPrincipal user, Long chckOrgId, String actionType) {
        CheckOrgBaseRes org = requireOrg(user, chckOrgId);

        if ("P".equals(actionType)) {
            // 점검자 체크
            if (mapper.countCheckerIdIsNull(chckOrgId) != 0) {
                throw fail("점검자가 지정되지 않은 점검항목이 존재합니다");
            }
            // 승인선 체크 : 1. 임원이 반드시 최종승인자이어야 함
            String lastApprEmp = mapper.checkLastApprEmp(chckOrgId);
            if (lastApprEmp == null) {
                throw fail("승인선이 존재하지 않습니다");
            }
            if (!"Y".equals(lastApprEmp)) {
                throw fail("승인선 확인 : 최종 승인자는 반드시 책무임원이어야 합니다");
            }
            // 승인선 체크 : 2. 동일부서에 승인자는 반드시 1명이어야 함
            if (!mapper.selectDuplicatedApprOrgs(chckOrgId).isEmpty()) {
                throw fail("승인선 확인 : 부서별 승인자는 1명만 지정해 주세요");
            }
            // 승인선 체크 : 3. 퇴사자 체크. 점검시작일을 기준으로 재직중이어야 함
            String retireEmps = mapper.selectRetireEmp(chckOrgId);
            if (retireEmps != null) {
                throw fail("승인자 또는 점검자에 퇴사자(" + retireEmps + ")가 지정되어 있습니다 ");
            }
            // 1.점검항목별 승인내역(tdm60) insert
            mapper.insertManlApprByApprStep(chckOrgId, org.companyId());
            // 2.점검상태(tdm52_check_status_cd)를 '점검대기(10)'로 일괄 update
            mapper.updateCheckStatusByChckOrgId(chckOrgId, "10", user.getName());
        } else if ("C".equals(actionType)) {
            // 1.점검항목별 승인내역(tdm60) delete
            mapper.deleteManlApprByChckOrgId(chckOrgId);
            // 2.점검상태(tdm52_check_status_cd)를 'null'로 일괄 update
            mapper.updateCheckStatusByChckOrgId(chckOrgId, null, user.getName());
        } else {
            throw fail("정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요 [" + actionType + "]");
        }

        // 3.직책별 승인의견(tdm59) insert&delete
        String resultMsg = mapper.createTdm59(actionType, chckOrgId);
        if (!"Y".equals(resultMsg)) {
            throw fail(resultMsg);
        }
    }

    /** AS-IS tdm.Tdm51_ChckOrg.updateApprStatus — actionType P(승인요청)·C(요청취소). 점검 이력(tdm55)을 단계마다 남긴다 */
    @Transactional
    public void updateApprStatus(UserPrincipal user, Long chckOrgId, String actionType) {
        CheckOrgBaseRes org = requireOrg(user, chckOrgId);
        String stdDate = mapper.selectCheckStartDate(org.chckJobId());
        String updName = user.getName();
        Long personId = user.getUserId();
        Long relateId;
        String procType;

        // ----- 승인요청 (대상 : 점검상태가 '점검완료(19)'인 점검항목들) -----
        if ("P".equals(actionType)) {
            procType = "승인요청";
            relateId = null;

            // 1.점검항목별 승인상태 '대기(10)' update : tdm60_appr_status_cd = '10'
            mapper.updateManlApprStatusByChckOrgId(chckOrgId, "19", "10");   // (19:점검완료)

            // 2.점검항목별 점검상태 '승인요청(20)' update + 점검이력(tdm55)
            for (Long chckManlId : mapper.selectChckManlIdsByCheckStatus(chckOrgId, "19")) {
                mapper.updateCheckStatusById(chckManlId, "20", updName);      // (20:승인요청)
                record(org.companyId(), stdDate, chckManlId, "TDM52", procType, personId);
            }

            // 3.승인자별 승인상태 최초승인자(부서장)만 '대기(10)', 나머지는 null update : tdm59_appr_status_cd
            int i = 0;
            for (CheckApprStepOrgRes step : mapper.selectApprStep(chckOrgId)) {
                i++;

                // 3-1.상위조직 상태체크
                if (step.parentOrgId() != 0) {
                    CheckApprCmntRes parent = mapper.selectApprCmntByApprOrgId(chckOrgId, step.parentOrgId());
                    if (parent != null && "20".equals(parent.apprStatusCode())) {   // (20:승인)
                        throw fail("승인자(" + parent.apprOrgName() + " " + parent.apprEmpName() + ")의 승인처리가 완료되었습니다. 승인취소가 필요합니다");
                    }
                }

                // 3-2.승인상태 update (최초승인자:대기(10), 상위 승인자들:null)
                CheckApprCmntRes cmnt = requireApprCmnt(chckOrgId, step.apprOrgId());
                if (i == 1) {   // 최초승인자
                    relateId = cmnt.chckApprCmntId();
                    // 최초승인자 'SUB'에 점검부서 존재시 해당건도 승인상태 '대기(10)'로 update
                    mapper.updateApprCmntStatusBySubCheckOrg(cmnt.chckApprCmntId(), "10", org.orgId());
                    mapper.updateApprCmntStatus(cmnt.chckApprCmntId(), "10");
                } else {
                    mapper.updateApprCmntStatus(cmnt.chckApprCmntId(), null);
                }
            }

            // 4. 미흡/개선 조치완료건 승인선 생성 : tdm61 insert (기존 승인선은 먼저 정리 — 반려처리된 경우 정리되지 않는다)
            mapper.deleteInsuffApprByChckOrgId(chckOrgId);
            mapper.insertInsuffApprByApprStep(chckOrgId);

            // 5. 미흡/개선 조치내역(tdm54) 조치상태 update : 조치완료(19) => 승인요청(20)
            for (CheckInsuffTarget target : mapper.selectInsuffApprTarget(chckOrgId, "19")) {
                mapper.updateInsuffStatus(target.chckInsuffId(), "20", org.checkYm(), updName);
                record(target.companyId(), stdDate, target.chckInsuffId(), "TDM54", procType, personId);
            }
        }
        // ----- 승인요청 취소 (대상 : 점검상태가 '승인요청(20)'인 점검항목들) -----
        else if ("C".equals(actionType)) {
            procType = "승인요청취소";

            // 1.점검항목별 승인상태 null update
            mapper.updateManlApprStatusByChckOrgId(chckOrgId, "20", null);

            // 2.점검항목별 점검상태 '점검완료(19)' update + 점검이력(tdm55)
            for (Long chckManlId : mapper.selectChckManlIdsByCheckStatus(chckOrgId, "20")) {
                mapper.updateCheckStatusById(chckManlId, "19", updName);
                record(org.companyId(), stdDate, chckManlId, "TDM52", procType, personId);
            }

            // 3.최초승인자 Get
            List<CheckApprStepOrgRes> steps = mapper.selectApprStep(chckOrgId);
            if (steps.isEmpty()) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }

            // 4. 최초승인자의 승인상태(tdm59_appr_status_cd) null update
            CheckApprCmntRes cmnt = requireApprCmnt(chckOrgId, steps.get(0).apprOrgId());
            mapper.updateApprCmntStatus(cmnt.chckApprCmntId(), null);
            mapper.updateApprCmntStatusBySubCheckOrg(cmnt.chckApprCmntId(), null, org.orgId());
            relateId = cmnt.chckApprCmntId();

            // 5. 미흡/개선 조치내역(tdm54) 조치상태 update : 승인요청(20) => 조치완료(19), 6. 조치완료건 승인선 삭제 : tdm61 delete
            for (CheckInsuffTarget target : mapper.selectInsuffApprTarget(chckOrgId, "20")) {
                mapper.updateInsuffStatus(target.chckInsuffId(), "19", null, updName);
                record(target.companyId(), stdDate, target.chckInsuffId(), "TDM54", procType, personId);
                mapper.deleteInsuffApprByChckInsuffId(target.chckInsuffId());
            }
        } else {
            throw fail("정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요 [" + actionType + "]");
        }

        // TDM59 점검이력 생성(tdm55)
        record(org.companyId(), stdDate, relateId, "TDM59", procType, personId);
    }

    private void record(Long companyId, String stdDate, Long relateTableId, String relateTable, String procType, Long personId) {
        recordMapper.insertRecord(new CheckRecordParam(companyId, stdDate, relateTableId, relateTable, procType, personId));
    }

    private CheckApprCmntRes requireApprCmnt(Long chckOrgId, Long apprOrgId) {
        CheckApprCmntRes cmnt = mapper.selectApprCmntByApprOrgId(chckOrgId, apprOrgId);
        if (cmnt == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return cmnt;
    }

    private CheckOrgBaseRes requireOrg(UserPrincipal user, Long chckOrgId) {
        CheckOrgBaseRes org = mapper.selectById(chckOrgId);
        if (org == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!org.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return org;
    }

    /** AS-IS result.fail(-1, 메시지) — 화면이 그 문구를 그대로 보여 준다 */
    private static BusinessException fail(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
