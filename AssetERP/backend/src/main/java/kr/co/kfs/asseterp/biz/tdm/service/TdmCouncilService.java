package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRoleLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilRoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CouncilSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCouncilMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 회의체 등록 (AS-IS server/tdm/Tdm05_Cncl, Tdm22_RoleRelateCncl, 직책 고르기는 Tdm20_Role.selectByDate) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmCouncilService {

    private final TdmCouncilMapper mapper;

    /** AS-IS tdm.Tdm05_Cncl.selectByDate */
    public List<CouncilRes> search(UserPrincipal user, LocalDate baseDate, boolean allYn, Long roleId) {
        return mapper.selectByDate(user.getCompanyId(), baseDate, allYn, roleId);
    }

    /** AS-IS Tdm05_Cncl.modelUpdate: cnclId가 없으면 새 ID(DB 시퀀스)로 INSERT, 있으면 UPDATE. 저장한 행을 돌려준다 */
    @Transactional
    public CouncilRes save(UserPrincipal user, CouncilSaveReq req) {
        if (isBlank(req.cnclName())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회의체는 필수입력 항목입니다");
        }
        if (isBlank(req.openCycleCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "개최주기는 필수선택 항목입니다");
        }
        if (isBlank(req.mainDecision())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "주요의결사항은 필수입력 항목입니다");
        }
        if (req.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용시작일은 필수선택 항목입니다");
        }
        Long id = req.cnclId();
        if (id == null || id <= 0) {
            id = mapper.selectNextId();
            mapper.insertCouncil(id, user.getCompanyId(), req, user.getName());
        } else {
            checkCompany(user, id);
            mapper.updateCouncil(req, user.getName());
        }
        return mapper.selectById(id, user.getCompanyId());
    }

    /** AS-IS Tdm05_Cncl.delete: 행마다 연결된 직책이 있으면 중단 (회의체 이름을 알린다) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> cnclIds) {
        if (cnclIds == null || cnclIds.isEmpty()) {
            return 0;
        }
        for (Long id : cnclIds) {
            checkCompany(user, id);
            if (mapper.countUseByCnclId(id) != 0) {
                CouncilRes row = mapper.selectById(id, user.getCompanyId());
                throw new BusinessException(ErrorCode.INVALID_INPUT, "직책에 연결되어 있는 회의체 정보입니다. (회의체:" + row.cnclName() + ")");
            }
        }
        return mapper.deleteCouncils(cnclIds);
    }

    /** AS-IS tdm.Tdm22_RoleRelateCncl.selectByCnclId */
    public List<CouncilRoleRes> searchRoles(UserPrincipal user, Long cnclId) {
        return mapper.selectRolesByCnclId(cnclId, user.getCompanyId());
    }

    /** AS-IS Tdm22_RoleRelateCncl.update: ID ≤ 0이면 INSERT, 아니면 역할·적용기간만 UPDATE. 저장한 행을 요청 순서로 돌려준다 */
    @Transactional
    public List<CouncilRoleRes> saveRoles(UserPrincipal user, Long cnclId, List<CouncilRoleRes> rows) {
        checkCompany(user, cnclId);
        List<Long> ids = new ArrayList<>();
        for (CouncilRoleRes row : rows) {
            if (isBlank(row.memberType())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "역할은 필수선택 항목입니다");
            }
            if (row.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용시작일은 필수입력 항목입니다");
            }
            CouncilRoleRes normalized = new CouncilRoleRes(row.roleRelateCnclId(), row.roleId(), cnclId, row.roleName(),
                    row.memberType(), row.memberTypeName(), row.startDate(), row.endDate());
            if (row.roleRelateCnclId() == null || row.roleRelateCnclId() <= 0) {
                Long roleCompany = row.roleId() == null ? null : mapper.selectRoleCompanyId(row.roleId());
                if (roleCompany == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                if (!roleCompany.equals(user.getCompanyId())) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                Long newId = mapper.selectNextId();
                mapper.insertRole(newId, normalized);
                ids.add(newId);
            } else {
                CouncilRoleRes origin = mapper.selectRoleById(row.roleRelateCnclId());
                if (origin == null || !cnclId.equals(origin.cnclId())) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                mapper.updateRole(normalized);
                ids.add(row.roleRelateCnclId());
            }
        }
        return ids.stream().map(mapper::selectRoleById).toList();
    }

    /** AS-IS Tdm22_RoleRelateCncl.delete */
    @Transactional
    public int deleteRoles(UserPrincipal user, Long cnclId, List<Long> roleRelateCnclIds) {
        checkCompany(user, cnclId);
        if (roleRelateCnclIds == null || roleRelateCnclIds.isEmpty()) {
            return 0;
        }
        for (Long id : roleRelateCnclIds) {
            CouncilRoleRes origin = mapper.selectRoleById(id);
            if (origin != null && !cnclId.equals(origin.cnclId())) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
        }
        return mapper.deleteRoles(roleRelateCnclIds);
    }

    /** AS-IS tdm.Tdm20_Role.selectByDate (직책 고르기창, searchText는 '%…%'로 감싼다) */
    public List<CouncilRoleLookupRes> searchRoleLookup(UserPrincipal user, LocalDate baseDate, String searchText) {
        return mapper.selectRoleLookup(user.getCompanyId(), baseDate, "%" + searchText + "%");
    }

    /** 회의체가 로그인 회사 것이어야 한다 */
    private void checkCompany(UserPrincipal user, Long cnclId) {
        if (cnclId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = mapper.selectCompanyId(cnclId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static boolean isBlank(String v) {
        return v == null || v.isBlank();
    }
}
