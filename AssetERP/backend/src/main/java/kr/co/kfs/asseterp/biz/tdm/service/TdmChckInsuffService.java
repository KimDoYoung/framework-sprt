package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRecordReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRecordSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffResultReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCompanySetup;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRecordParam;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckApprMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckManlMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckOrgMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckInsuffMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckRecordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 미흡/개선 내역 — 조치계획 등록 (AS-IS Tdm54_Edit_ChckInsuff, N22)과 조치 처리 (Tdm54_Tab_CheckInsuff·Tdm54_Lookup_ChckInsuff, N24) → server/tdm/Tdm54_ChckInsuff·Tdm63_ChckInsuffRecord */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmChckInsuffService {

    private final TdmChckInsuffMapper mapper;
    private final TdmCheckManlService checkManlService;
    private final TdmCheckOrgMapper orgMapper;
    private final TdmChckRecordMapper recordMapper;
    private final TdmCheckManlMapper manlMapper;
    private final TdmCheckApprMapper apprMapper;

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByChckManlId — 점검항목의 조치계획 한 건, 없으면 null */
    public ChckInsuffRes searchByManl(UserPrincipal user, Long chckManlId) {
        checkManlService.requireManl(user, chckManlId);
        List<ChckInsuffRes> list = mapper.selectByChckManlId(chckManlId);
        return list.isEmpty() ? null : list.get(0);
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.modelUpdate — chckInsuffId가 없으면 최초등록(상태 10 발생), 있으면 계획변경. 점검이력(tdm55)을 남긴다 */
    @Transactional
    public ChckInsuffRes save(UserPrincipal user, ChckInsuffSaveReq req) {
        CheckManlDetailRes manl = checkManlService.requireManl(user, req.chckManlId());
        Long chckInsuffId = req.chckInsuffId();
        String procType;
        if (chckInsuffId == null) {
            procType = "발생(최초등록)";
            chckInsuffId = mapper.selectNextId();
            mapper.insertInsuff(chckInsuffId, req, manl.companyId(), manl.roleId(), manl.orgId(), user.getUserId(), "10", manl.checkYm(), user.getName());
        } else {
            procType = "발생(계획변경)";
            boolean mine = false;
            for (ChckInsuffRes row : mapper.selectByChckManlId(manl.chckManlId())) {
                if (chckInsuffId.equals(row.chckInsuffId())) {
                    mine = true;
                }
            }
            if (!mine || mapper.updateInsuff(req, manl.companyId(), user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }

        // 점검이력 생성(tdm55)
        String stdDate = req.stdDate() != null ? req.stdDate() : orgMapper.selectCheckStartDate(manl.chckJobId());
        recordMapper.insertRecord(new CheckRecordParam(manl.companyId(), stdDate, chckInsuffId, "TDM54", procType, user.getUserId(), "미흡", req.actionPlan(), null));
        return searchByManl(user, manl.chckManlId());
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByRegDate — 로그인 회사. statusCode는 'LIKE' 값('%'면 전체) */
    public List<ChckInsuffListRes> search(UserPrincipal user, String startDate, String endDate, boolean unDoneYn, Long roleId, Long orgId, String statusCode) {
        return mapper.selectByRegDate(user.getCompanyId(), startDate, endDate, unDoneYn, roleId, orgId, statusCode == null ? "%" : statusCode);
    }

    /** AS-IS tdm.Tdm51_ChckOrg.getTdmOrgId — 로그인 사용자의 현재 부서가 속한 책무 대상 부서, 없으면 null */
    public Long getTdmOrgId(UserPrincipal user) {
        return user.getUserId() == null || user.getUserId() < 0 ? null : mapper.selectTdmOrgId(user.getCompanyId(), user.getUserId());
    }

    /**
     * AS-IS tdm.Tdm54_ChckInsuff.updateComplete — procType U 저장·P 조치완료·C 완료취소. 응답은 다시 읽은 행.
     * P의 "최종 책무이행점검년월 승인요청 전" 검사(selectPossibleYn → f_get_tdmInsuffPossibleYn)는 이 DB에 함수가 없어 생략한다(N24 작업기록, 사용자 결정 2026-10-25)
     */
    @Transactional
    public ChckInsuffListRes updateResult(UserPrincipal user, Long chckInsuffId, ChckInsuffResultReq req) {
        ChckInsuffListRes row = require(user, chckInsuffId);
        String procType = req.procType();
        String statusCode = row.statusCode();
        String procTypeName = null;

        if ("P".equals(procType)) {
            // 조치결과 글자수 체크
            checkManlService.checkCmntLimit(row.companyId(), req.actionDate(), req.actionCmnt());
            // 증빙파일 필수등록 체크여부가 'true'이면 증빙자료 필수
            CheckCompanySetup setup = manlMapper.selectCompanySetupByDate(row.companyId(), req.actionDate());
            if ((setup == null || Boolean.TRUE.equals(setup.evidFileCheckYn())) && mapper.countEvid(chckInsuffId) == 0) {
                throw fail("증빙자료가 존재하지 않습니다");
            }
            statusCode = "19";
            procTypeName = "조치완료";
        } else if ("C".equals(procType)) {
            // 승인내역 존재시 조치완료취소 불가
            if (mapper.countApprByChckInsuffId(chckInsuffId) != 0) {
                throw fail("승인진행(또는 완료) 내역입니다. 취소할 수 없습니다");
            }
            statusCode = "11";
            procTypeName = "조치완료취소";
        } else if (!"U".equals(procType)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        // 조치완료·취소시에만 점검이력 생성(tdm55)
        if (!"U".equals(procType)) {
            recordMapper.insertRecord(new CheckRecordParam(row.companyId(), req.actionDate(), chckInsuffId, "TDM54", procTypeName, req.actionEmpId(), null, req.actionCmnt(), null));
        }
        mapper.updateResult(chckInsuffId, row.companyId(), statusCode, req.dueDate(), req.actionDate(), req.actionEmpId(), req.actionCmnt(), user.getName());
        return mapper.selectById(chckInsuffId);
    }

    /** AS-IS recordUpdate — Tdm63_ChckInsuffRecord.delete 다음 update. 응답은 다시 읽은 조치기록 */
    @Transactional
    public List<CheckApprInsuffRecordRes> saveRecords(UserPrincipal user, Long chckInsuffId, ChckInsuffRecordSaveReq req) {
        require(user, chckInsuffId);
        List<Long> owned = mapper.selectRecordIds(chckInsuffId);
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            for (Long id : req.deleteIds()) {
                if (!owned.contains(id)) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            mapper.deleteRecords(chckInsuffId, req.deleteIds());
        }
        if (req.rows() != null) {
            for (ChckInsuffRecordReq r : req.rows()) {
                if (r.regDate() == null) {
                    throw fail("등록일을 입력하세요");
                }
                if (r.content() == null) {
                    throw fail("조치내용을 입력하세요");
                }
                if (r.chckInsuffRecordId() == null || r.chckInsuffRecordId() <= 0) {
                    mapper.insertRecord(mapper.selectNextId(), chckInsuffId, r, user.getUserId(), user.getName());
                } else if (!owned.contains(r.chckInsuffRecordId()) || mapper.updateRecord(chckInsuffId, r, user.getName()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
        }
        return apprMapper.selectInsuffRecords(chckInsuffId);
    }

    private ChckInsuffListRes require(UserPrincipal user, Long chckInsuffId) {
        ChckInsuffListRes row = mapper.selectById(chckInsuffId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!row.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return row;
    }

    /** AS-IS result.fail(-1, 메시지) — 화면이 그 문구를 그대로 보여 준다 */
    private static BusinessException fail(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
