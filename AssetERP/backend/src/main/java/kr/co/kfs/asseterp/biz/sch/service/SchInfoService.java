package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoCopyReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoManagerRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoViewRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01OrgRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01OrgSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01PeriodRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01PeriodSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.sch.mapper.SchInfoMapper;
import kr.co.kfs.asseterp.biz.sch.mapper.SchWriteGroupMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 업무일정 (O01) — AS-IS Sch01_Tab_Info·Sch01_Lookup_Info·Sch01_Lookup_ManagerModi(Run) → server/sch/Sch01_Info.java
 * (selectByText L27 / selectById L22 / selectByManagerId L75 / checkSchInfo L81 / copySchedule L92 / update L199 / deleteByInfoId L207 / delete L212)
 * + Sch02_Share.java (selectByInfoId L35 / update L90 / delete L95). 회사는 로그인 회사로 채우고 조회·수정·삭제도 그 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchInfoService {

    private final SchInfoMapper mapper;
    /** 공유 INSERT/UPDATE/DELETE SQL은 작성그룹(Sch22)과 같은 sch02_share라 그 매퍼를 쓴다 */
    private final SchWriteGroupMapper shareMapper;
    private final SysFileService fileService;
    private final EmpTransInfoService transInfoService;

    /** AS-IS Sch01_Tab_Info.retrieve: 분류(없으면 전체)·주기구분(전체 '%')·검색(%글자%)·데일리만·사용만 */
    public List<Sch01InfoRes> search(UserPrincipal user, Long classId, String cycleCode, String searchText, boolean dailyYn, boolean useYn) {
        return mapper.selectByText(new Sch01InfoSearchCond(user.getCompanyId(), user.getUserId(), classId,
                cycleCode == null || cycleCode.isEmpty() ? "%" : cycleCode, "%" + (searchText == null ? "" : searchText) + "%", dailyYn, useYn));
    }

    /**
     * AS-IS Sch01_Tab_List.retrieve L202-236 → Sch01_Info.selectByCloseDate: 기간(마감일)·분류(없으면 전체)·공유구분(전체 '%'/나의 스케줄 '1'/공유 스케줄 '2')·주기구분(전체 '%')·
     * 데일리만·검색(%글자%). 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0
     */
    public List<Sch01PeriodRes> searchByPeriod(UserPrincipal user, LocalDate startDate, LocalDate endDate, Long classId, String shareType,
                                               String cycleCode, boolean dailyYn, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByCloseDate(new Sch01PeriodSearchCond(user.getCompanyId(), user.getUserId(), orgId, startDate, endDate, classId,
                shareType == null || shareType.isEmpty() ? "%" : shareType, cycleCode == null || cycleCode.isEmpty() ? "%" : cycleCode,
                String.valueOf(dailyYn), "%" + (searchText == null ? "" : searchText) + "%"));
    }

    /**
     * AS-IS Sch01_Tab_ListOrg.retrieve L193-218 → Sch01_Info.selectByOrg: 마감일 기간·부서(하위부서 포함 여부)·주기구분(전체 '%')·데일리만·검색(%글자%).
     * 회사는 로그인 회사로 채운다. 부서가 없으면 화면이 "부서를 선택하세요"로 막는다(서버도 같은 기준)
     */
    public List<Sch01OrgRes> searchByOrg(UserPrincipal user, Long orgId, boolean subOrgYn, LocalDate startDate, LocalDate endDate,
                                         String cycleCode, boolean dailyYn, String searchText) {
        if (orgId == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "부서를 선택하세요");
        return mapper.selectByOrg(new Sch01OrgSearchCond(user.getCompanyId(), orgId, subOrgYn, startDate, endDate, String.valueOf(dailyYn),
                cycleCode == null || cycleCode.isEmpty() ? "%" : cycleCode, "%" + (searchText == null ? "" : searchText) + "%"));
    }

    /** AS-IS Sch01_Lookup_InfoView.open(infoId, deadlineId) → Sch01_Info.selectByDeadLineId */
    public Sch01InfoViewRes getView(UserPrincipal user, Long infoId, Long deadlineId) {
        Sch01InfoViewRes row = mapper.selectByDeadlineId(user.getCompanyId(), infoId, deadlineId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS Sch01_Info.selectById */
    public Sch01InfoRes get(UserPrincipal user, Long infoId) {
        return require(user, infoId);
    }

    /**
     * AS-IS LoginUser.getIsUserManager(): 회사관리자가 아닌 사용자가 관리자 역할(sys04_admin_yn)을 가졌는가 (LoginPage.checkExt → sys.Sys05_UserRole.getAdminCheck).
     * 담당자 변경 창에서 다른 담당자를 고를 수 있는 사람
     */
    public boolean isUserManager(UserPrincipal user) {
        return user.getUserId() >= 0 && mapper.countAdminRole(user.getCompanyId(), user.getUserId()) > 0;
    }

    /** AS-IS Sch01_Lookup_ManagerModi.retrieve → selectByManagerId. 원본은 관리자만 담당자 칸을 바꿀 수 있다(managerName.setEnabled(false)) — 서버도 같은 기준 */
    public List<Sch01InfoManagerRes> searchByManager(UserPrincipal user, Long managerId, Long classId, String searchText) {
        requireOwnOrUserManager(user, managerId);
        return mapper.selectByManagerId(user.getCompanyId(), managerId, classId, "%" + (searchText == null ? "" : searchText).toUpperCase() + "%");
    }

    /**
     * AS-IS Sch01_Tab_Info.insertRow + Sch01_Lookup_Info.open("new") → update01(): 담당자=로그인 사용자·사용=true인 빈 행을 먼저 만든다.
     * 등록 창을 저장 없이 닫으면 {@link #rollback}으로 되돌린다 → 만든 행
     */
    @Transactional
    public Sch01InfoRes create(UserPrincipal user) {
        long infoId = mapper.selectNextId();
        mapper.insertInfo(infoId, user.getCompanyId(), user.getUserId());
        return require(user, infoId);
    }

    /** AS-IS Sch01_Lookup_Info.update → Sch01_Info.update(UpdateDataModel UPDATE) → 저장한 행(updateEnd의 selectById) */
    @Transactional
    public Sch01InfoRes update(UserPrincipal user, Long infoId, Sch01InfoSaveReq req) {
        if (mapper.updateInfo(infoId, user.getCompanyId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "업무일정을 찾을 수 없습니다.");
        }
        return require(user, infoId);
    }

    /**
     * AS-IS Sch01_Tab_Info.delete: checkSchInfo → 이미 발생한 스케줄이 있으면 삭제 못 함, 없으면 delete. 원본은 선택한 여러 건 중
     * <b>마지막 건만</b> 검사한다(루프에서 결과를 덮어씀) — 그대로 옮긴다(작업기록 제안) → 지운 건수
     */
    @Transactional
    public int delete(UserPrincipal user, List<Long> infoIds) {
        if (infoIds == null || infoIds.isEmpty()) {
            return 0;
        }
        if (mapper.countSchList(infoIds.get(infoIds.size() - 1)) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 발생한 스케줄이므로 삭제할 수 없는 정보입니다");
        }
        return mapper.deleteInfos(user.getCompanyId(), infoIds);
    }

    /** AS-IS Sch01_Lookup_Info.newDataRollback → Sch01_Info.deleteByInfoId: 등록 창을 닫을 때 새 행을 되돌린다 */
    @Transactional
    public int rollback(UserPrincipal user, Long infoId) {
        return mapper.deleteByInfoId(infoId, user.getCompanyId());
    }

    // ===== 일정공유 =====

    /** AS-IS Sch02_Share.selectByInfoId */
    public List<Sch02ShareRes> searchShares(UserPrincipal user, Long infoId) {
        require(user, infoId);
        return mapper.selectSharesByInfoId(user.getCompanyId(), infoId);
    }

    /** AS-IS Sch02_Share.update(UpdateDataModel): 새 행(≤ 0)은 INSERT(구분·직원·부서), 있는 행은 적용기간 UPDATE → 저장한 행(요청 순서) */
    @Transactional
    public List<Sch02ShareRes> saveShares(UserPrincipal user, Long infoId, List<Sch02ShareSaveReq> rows) {
        Long companyId = user.getCompanyId();
        require(user, infoId);
        List<Sch02ShareRes> saved = new ArrayList<>();
        for (Sch02ShareSaveReq req : rows) {
            Long shareId = req.shareId();
            if (shareId == null || shareId <= 0) {
                shareId = shareMapper.selectNextId();
                shareMapper.insertShare(companyId, infoId, shareId, req);
            } else {
                shareMapper.updateShare(companyId, infoId, req);
            }
            saved.add(mapper.selectShareById(companyId, shareId));
        }
        return saved;
    }

    /** AS-IS Sch02_Share.delete(UpdateDataModel.deleteModel) → 지운 수 */
    @Transactional
    public int deleteShares(UserPrincipal user, Long infoId, List<Long> shareIds) {
        if (shareIds == null || shareIds.isEmpty()) {
            return 0;
        }
        require(user, infoId);
        return shareMapper.deleteShares(user.getCompanyId(), infoId, shareIds);
    }

    // ===== 담당자 변경 =====

    /**
     * AS-IS Sch01_Info.copySchedule L92-197: 고른 일정을 (분류가 이어지는 순서로) 새 담당자 것으로 복사한다 — 분류 → 일정 → 공유 → 기한 →
     * 법규연결 → 알람(사용 중인 것만) → 첨부파일 연결. 처리구분이 MOVE면 원래 일정을 미사용으로 바꾼다
     */
    @Transactional
    public void copy(UserPrincipal user, Sch01InfoCopyReq req) {
        if (req.managerId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "변경 후 담당자를 선택하세요");
        }
        if (req.infoIds() == null || req.infoIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "스케줄을 선택하세요");
        }
        Long managerId = req.managerId();
        Long classId = null;
        Long newClassId = null;
        List<Sch01InfoManagerRes> sources = mapper.selectByIdList(user.getCompanyId(), req.infoIds());
        for (Sch01InfoManagerRes src : sources) {
            requireOwnOrUserManager(user, src.managerId());
        }
        for (Sch01InfoManagerRes src : sources) {
            // 문서분류 생성(sch08)
            if (src.classId() != null) {
                if (!src.classId().equals(classId)) {
                    classId = src.classId();
                    newClassId = mapper.selectNextId();
                    mapper.insertClassByClassId(src.classId(), newClassId, managerId, "담당자 변경 작업으로 자동생성");
                }
            } else {
                classId = null;
                newClassId = null;
            }
            // 스케줄·공유자·주기·법규연결·알람 생성(sch01·02·03·05·06)
            long newInfoId = mapper.selectNextId();
            mapper.insertInfoByInfoId(src.infoId(), newInfoId, managerId, newClassId);
            mapper.insertShareByInfoId(src.infoId(), newInfoId);
            mapper.insertDeadlineByInfoId(src.infoId(), newInfoId);
            mapper.insertRelateIcsByInfoId(src.infoId(), newInfoId);
            mapper.insertAlarmByTargetId("SCH", src.infoId(), newInfoId);
            // 파일 Copy(sys10 → sys11 연결)
            for (FileRes file : fileService.searchByParentId(src.infoId())) {
                mapper.insertRelateFile(mapper.selectNextId(), file.fileId(), newInfoId, "sch01_info");
            }
            // 이동인 경우 변경 전 담당자의 스케줄 미사용 update
            if ("MOVE".equals(req.procType())) {
                mapper.updateUseYnFalseByInfoId(src.infoId());
            }
        }
    }

    /** 내 일정이거나 관리자 역할이 있어야 다른 담당자의 일정을 다룬다(담당자 변경 창) */
    private void requireOwnOrUserManager(UserPrincipal user, Long managerId) {
        if (!Objects.equals(managerId, user.getUserId()) && !isUserManager(user)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private Sch01InfoRes require(UserPrincipal user, Long infoId) {
        Sch01InfoRes row = mapper.selectById(infoId, user.getCompanyId());
        if (row == null || !Objects.equals(row.infoId(), infoId)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "업무일정을 찾을 수 없습니다.");
        }
        return row;
    }
}
