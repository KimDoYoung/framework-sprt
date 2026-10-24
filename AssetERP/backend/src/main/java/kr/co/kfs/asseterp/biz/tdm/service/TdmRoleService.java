package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleCouncilRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleTaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCouncilMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/** 직책별 책무 등록 (AS-IS server/tdm/Tdm20_Role, Tdm21_RoleRelateTask, Tdm22_RoleRelateCncl, Tdm23_RoleRelateOrg) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmRoleService {

    private static final String TABLE = "tdm20_role";
    /** 화면번호 — AS-IS 화면 코드가 historyMap에 "1414"를 넣는다 */
    private static final String MENU_NO = "1414";
    private static final String CEO_TYPE = "C";
    private static final String ETC_TYPE = "E";

    private final TdmRoleMapper mapper;
    private final TdmCouncilMapper councilMapper;
    private final TdmChangeHistoryService historyService;

    /** AS-IS tdm.Tdm20_Role.selectByDate (searchText는 '%…%', roleType이 있으면 그 직책그룹만) */
    public List<RoleRes> search(UserPrincipal user, LocalDate baseDate, boolean allYn, String searchText, String roleType) {
        return mapper.selectByDate(user.getCompanyId(), baseDate, allYn, "%" + (searchText == null ? "" : searchText) + "%",
                roleType == null || roleType.isEmpty() ? null : roleType);
    }

    /** AS-IS tdm.Tdm20_Role.countUseByRoleId: 건수 합 */
    public int countUse(UserPrincipal user, List<Long> roleIds) {
        int sum = 0;
        for (Long id : roleIds) {
            checkCompany(user, id);
            sum += mapper.countUseByRoleId(id);
        }
        return sum;
    }

    /**
     * AS-IS Tdm20_Edit_Role.updateChk·preUpdate + Tdm20_Role.modelUpdate: 필수 검사 → 보고CEO로 쓰인 직책의 직책그룹 변경 거부 →
     * (수정이면) 변경사유와 함께 바뀐 열의 G-UPDATE 이력을 먼저 만들고 저장. roleId가 없으면 새 직책(이력 없음).
     */
    @Transactional
    public RoleRes save(UserPrincipal user, RoleSaveReq req) {
        if (isBlank(req.roleName())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "직책는 필수입력 항목입니다");
        }
        if (isBlank(req.roleType())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "직책그룹은 필수선택 항목입니다");
        }
        if (isBlank(req.overview())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "개요는 필수입력 항목입니다");
        }
        if (req.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용시작일은 필수선택 항목입니다");
        }
        if (ETC_TYPE.equals(req.roleType()) && isBlank(req.roleTypeEtcName())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기타그룹명은 필수입력 항목입니다");
        }
        if (req.ceoRoleId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "보고CEO는 필수선택 항목입니다");
        }
        checkCeoRole(user, req.ceoRoleId());
        // 기타그룹이 아니면 기타그룹명은 비운다 (AS-IS roleTypeName 콤보 Collapse)
        RoleSaveReq normalized = new RoleSaveReq(req.roleId(), req.roleName(), req.roleType(),
                ETC_TYPE.equals(req.roleType()) ? req.roleTypeEtcName() : null, req.overview(), req.startDate(), req.endDate(),
                req.ceoRoleId(), null);

        Long id = req.roleId();
        if (id == null || id <= 0) {
            id = mapper.selectNextId();
            mapper.insertRole(id, user.getCompanyId(), normalized, user.getName());
            return mapper.selectById(id);
        }

        checkCompany(user, id);
        RoleRes origin = mapper.selectById(id);
        if (!CEO_TYPE.equals(req.roleType()) && mapper.countCeoRef(id) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "보고CEO로 등록되어있는 직책은 직책그룹 수정이 불가합니다");
        }

        // getHistoryMap() L374-487: 바뀐 열만 (null은 빈 글자로 비교)
        List<Map<String, String>> cols = new ArrayList<>();
        if (!Objects.equals(origin.roleName(), normalized.roleName())) {
            cols.add(TdmChangeHistoryService.column("직책명", "tdm20_role_nm", normalized.roleName()));
        }
        if (!Objects.equals(origin.roleType(), normalized.roleType())) {
            cols.add(TdmChangeHistoryService.column("직책그룹", "tdm20_role_type", normalized.roleType()));
        }
        if (!nz(origin.roleTypeEtcName()).equals(nz(normalized.roleTypeEtcName()))) {
            cols.add(TdmChangeHistoryService.column("기타그룹명", "tdm20_role_type_etc_nm", normalized.roleTypeEtcName()));
        }
        if (!nz(origin.overview()).equals(nz(normalized.overview()))) {
            cols.add(TdmChangeHistoryService.column("개요", "tdm20_overview", normalized.overview()));
        }
        if (!Objects.equals(origin.ceoRoleId(), normalized.ceoRoleId())) {
            cols.add(TdmChangeHistoryService.column("보고CEO", "tdm20_ceo_role_id", normalized.ceoRoleId().toString()));
        }
        if (!date(origin.startDate()).equals(date(normalized.startDate()))) {
            cols.add(TdmChangeHistoryService.column("사용시작일", "tdm20_start_date", date(normalized.startDate())));
        }
        if (!date(origin.endDate()).equals(date(normalized.endDate()))) {
            cols.add(TdmChangeHistoryService.column("사용종료일", "tdm20_end_date", date(normalized.endDate())));
        }
        if (cols.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "변경사항이 없습니다");
        }
        if (isBlank(req.reason())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "저장이 취소되었습니다 (변경사유 미입력)");
        }
        Map<String, Object> history = historyService.newHistory(user, MENU_NO, "UPDATE", TABLE, req.reason());
        history.put("targetKeyId", id.toString());
        history.put("modiColumnList", cols);
        historyService.insertModifyHistory(history);

        RoleSaveReq toSave = new RoleSaveReq(id, normalized.roleName(), normalized.roleType(), normalized.roleTypeEtcName(),
                normalized.overview(), normalized.startDate(), normalized.endDate(), normalized.ceoRoleId(), null);
        if (mapper.updateRole(user.getCompanyId(), toSave, user.getName()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(id);
    }

    /** AS-IS Tdm20_Lookup_SelectSingle.confirm(roleModel != null): 그 직책의 보고CEO만 바꾼다 (이력 없음) */
    @Transactional
    public RoleRes updateCeo(UserPrincipal user, Long roleId, Long ceoRoleId) {
        checkCompany(user, roleId);
        if (ceoRoleId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 직책이 없습니다");
        }
        checkCeoRole(user, ceoRoleId);
        mapper.updateCeo(user.getCompanyId(), roleId, ceoRoleId, user.getName());
        return mapper.selectById(roleId);
    }

    /** AS-IS Tdm20_Role.delete: 직책마다 임원별 직책배정 사용을 검사(있으면 전체 중단)하고 삭제이력(DELETE)을 만든 뒤 삭제 */
    @Transactional
    public int delete(UserPrincipal user, TaskDeleteReq req) {
        if (req.ids() == null || req.ids().isEmpty()) {
            return 0;
        }
        if (isBlank(req.reason())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "삭제가 취소되었습니다 (사유 미입력)");
        }
        for (Long id : req.ids()) {
            checkCompany(user, id);
            if (mapper.countUseByRoleId(id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "연결되어 있는 직책입니다");
            }
            historyService.insertDeleteHistory(user, MENU_NO, TABLE, id, req.reason());
        }
        return mapper.deleteRoles(req.ids(), user.getCompanyId());
    }

    // ---- 연결책무 (Tdm21_Lookup_RoleRelateTask) ----

    /** AS-IS tdm.Tdm21_RoleRelateTask.selectByRoloId */
    public List<RoleTaskRes> searchTasks(UserPrincipal user, Long roleId) {
        checkCompany(user, roleId);
        return mapper.selectTasksByRoleId(roleId);
    }

    /** AS-IS Tdm21_RoleRelateTask.update: 이 연결은 고칠 열이 없어 새 행(ID ≤ 0)만 INSERT. 넣은 건수를 돌려준다 */
    @Transactional
    public int saveTasks(UserPrincipal user, Long roleId, List<RoleTaskRes> rows) {
        checkCompany(user, roleId);
        int n = 0;
        for (RoleTaskRes row : rows) {
            if (row.roleRelateTaskId() != null && row.roleRelateTaskId() > 0) {
                continue;
            }
            Long companyId = row.taskId() == null ? null : mapper.selectTaskCompanyId(row.taskId());
            if (companyId == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (!companyId.equals(user.getCompanyId())) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            n += mapper.insertRoleTask(mapper.selectNextRelateId(), roleId, row.taskId());
        }
        return n;
    }

    /** AS-IS Tdm21_RoleRelateTask.delete */
    @Transactional
    public int deleteTasks(UserPrincipal user, Long roleId, List<Long> ids) {
        checkCompany(user, roleId);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteRoleTasks(roleId, ids);
    }

    // ---- 연결회의체 (Tdm22_Lookup_RoleRelateCncl) ----

    /** AS-IS tdm.Tdm22_RoleRelateCncl.selectByRoleId */
    public List<RoleCouncilRes> searchCouncils(UserPrincipal user, Long roleId) {
        checkCompany(user, roleId);
        return mapper.selectCouncilsByRoleId(roleId);
    }

    /** AS-IS Tdm22_RoleRelateCncl.update: ID ≤ 0이면 INSERT(회의체의 회사 검사), 아니면 역할·적용기간 UPDATE */
    @Transactional
    public int saveCouncils(UserPrincipal user, Long roleId, List<RoleCouncilRes> rows) {
        checkCompany(user, roleId);
        int n = 0;
        for (RoleCouncilRes row : rows) {
            if (isBlank(row.memberType())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "역할은 필수선택 항목입니다");
            }
            if (row.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용시작일은 필수입력 항목입니다");
            }
            if (row.roleRelateCnclId() == null || row.roleRelateCnclId() <= 0) {
                Long companyId = row.cnclId() == null ? null : councilMapper.selectCompanyId(row.cnclId());
                if (companyId == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                if (!companyId.equals(user.getCompanyId())) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                n += mapper.insertRoleCouncil(mapper.selectNextRelateId(), roleId, row);
            } else {
                n += mapper.updateRoleCouncil(roleId, row);
            }
        }
        return n;
    }

    /** AS-IS Tdm22_RoleRelateCncl.delete */
    @Transactional
    public int deleteCouncils(UserPrincipal user, Long roleId, List<Long> ids) {
        checkCompany(user, roleId);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteRoleCouncils(roleId, ids);
    }

    // ---- 연결부서 (Tdm23_Lookup_RoleRelateOrg) ----

    /** AS-IS tdm.Tdm23_RoleRelateOrg.selectByRoleId (기준일의 조직) */
    public List<RoleOrgRes> searchOrgs(UserPrincipal user, Long roleId, LocalDate stdDate) {
        checkCompany(user, roleId);
        return mapper.selectOrgsByRoleId(user.getCompanyId(), stdDate, roleId);
    }

    /** AS-IS Tdm23_RoleRelateOrg.update: 새 행(ID ≤ 0)만 INSERT (조직이 로그인 회사 것인지 검사) */
    @Transactional
    public int saveOrgs(UserPrincipal user, Long roleId, LocalDate stdDate, List<RoleOrgRes> rows) {
        checkCompany(user, roleId);
        int n = 0;
        for (RoleOrgRes row : rows) {
            if (row.roleRelateOrgId() != null && row.roleRelateOrgId() > 0) {
                continue;
            }
            if (row.orgId() == null || mapper.countOrg(user.getCompanyId(), stdDate, row.orgId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            n += mapper.insertRoleOrg(mapper.selectNextRelateId(), roleId, row.orgId());
        }
        return n;
    }

    /** AS-IS Tdm23_RoleRelateOrg.delete */
    @Transactional
    public int deleteOrgs(UserPrincipal user, Long roleId, List<Long> ids) {
        checkCompany(user, roleId);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteRoleOrgs(roleId, ids);
    }

    /** 직책이 로그인 회사 것이어야 한다 */
    private void checkCompany(UserPrincipal user, Long roleId) {
        if (roleId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = mapper.selectCompanyId(roleId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** 보고CEO로 고른 직책도 로그인 회사 것이어야 한다 */
    private void checkCeoRole(UserPrincipal user, Long ceoRoleId) {
        checkCompany(user, ceoRoleId);
    }

    private static boolean isBlank(String v) {
        return v == null || v.isBlank();
    }

    private static String nz(String v) {
        return v == null ? "" : v;
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.toString();
    }
}
