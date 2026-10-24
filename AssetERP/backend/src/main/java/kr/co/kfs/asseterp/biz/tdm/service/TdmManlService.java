package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopyDutiesReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopyItemRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopyReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopyRow;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlCopySourceRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlFormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelatesRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlSourceRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlDutyMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlJobMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 부서 책무매뉴얼의 점검항목 (AS-IS Tdm43_Lookup_ManlItem → server/tdm/Tdm43_Manl) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManlService {

    private final TdmManlMapper mapper;
    private final TdmManlOrgService manlOrgService;
    private final TdmManlDutyMapper dutyMapper;
    private final TdmManlJobMapper jobMapper;

    /** AS-IS tdm.Tdm43_Manl.selectByManlOrgId — 부서 책무매뉴얼의 회사로 권한 범위를 검사한다 */
    public List<ManlItemRes> search(UserPrincipal user, Long manlOrgId, String useYn, String searchText) {
        manlOrgService.requireScope(user, manlOrgId);
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByManlOrgId(manlOrgId, useYn, like);
    }

    /** 등록창을 열 때 받는 새 점검항목 번호 (AS-IS DBUtil.setSeq). f_create_seq()는 쓰기 트랜잭션에서만 값이 나온다 */
    @Transactional
    public Long nextId(UserPrincipal user, Long manlOrgId) {
        manlOrgService.requireScope(user, manlOrgId);
        return mapper.selectNextId();
    }

    /** AS-IS Tdm43_Page_Relate.retrieve*Grid 4개: 점검항목에 연결된 법규·내규·양식·문서분류 */
    public ManlRelatesRes relates(UserPrincipal user, Long manlOrgId, Long manlId) {
        requireManl(user, manlOrgId, manlId, false);
        return new ManlRelatesRes(mapper.selectRelateIcs(manlId), mapper.selectRelateIcr(manlId),
                mapper.selectRelateForm(manlId), mapper.selectRelateDcr(manlId));
    }

    /**
     * AS-IS tdm.Tdm43_Manl.modelUpdate: 연결 법규·내규·양식·문서분류를 넣고 점검항목을 등록/수정한다(이미 있으면 수정).
     * 회사는 부서 책무매뉴얼의 회사(AS-IS는 로그인 회사). 점검항목코드는 등록할 때(또는 비어 있을 때) 새로 만든다.
     */
    @Transactional
    public void save(UserPrincipal user, ManlSaveReq req) {
        if (req.manlId() == null || req.manlOrgId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = manlOrgService.requireScope(user, req.manlOrgId());
        boolean exists = mapper.countById(req.manlId()) > 0;
        if (exists && !req.manlOrgId().equals(mapper.selectManlOrgIdByManlId(req.manlId()))) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        ids(req.relateIcsClassTreeIds()).forEach(id -> mapper.insertRelateIcs(req.manlId(), id));
        ids(req.relateIcrClassTreeIds()).forEach(id -> mapper.insertRelateIcr(req.manlId(), id));
        ids(req.relateFormFileIds()).forEach(id -> mapper.insertRelateForm(req.manlId(), id));
        ids(req.relateDcrClassTreeIds()).forEach(id -> mapper.insertRelateDcr(req.manlId(), id));
        String manlCode = mapper.selectNewManlCode(companyId);
        if (exists) {
            mapper.updateManl(req, manlCode, user.getName());
        } else {
            mapper.insertManl(req, companyId, manlCode, user.getUserId(), user.getName());
        }
    }

    /** AS-IS tdm.Tdm45·46·47_…delete / sys.Sys11_RelateFile.delete: 연결 한 건 삭제 (kind: ics·icr·form·dcr) */
    @Transactional
    public void deleteRelate(UserPrincipal user, Long manlOrgId, Long manlId, String kind, Long relateId) {
        requireManl(user, manlOrgId, manlId, true);
        int n = switch (kind) {
            case "ics" -> mapper.deleteRelateIcsById(manlId, relateId);
            case "icr" -> mapper.deleteRelateIcrById(manlId, relateId);
            case "form" -> mapper.deleteRelateFormById(manlId, relateId);
            case "dcr" -> mapper.deleteRelateDcrById(manlId, relateId);
            default -> throw new BusinessException(ErrorCode.INVALID_INPUT);
        };
        if (n == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /**
     * AS-IS sys.Sys10_File.selectUnConnTdmFormFile (Tdm43_Lookup_RelateFormFileList): 아직 연결 안 된 책무점검 양식.
     * 회사는 로그인 회사(원본이 sys10_parent_id에 회사 ID를 넣는다). formType은 '%'(전체)·코드
     */
    public List<ManlFormFileRes> formFiles(UserPrincipal user, String formType, String searchText, Long relateId) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectUnConnFormFiles(user.getCompanyId(), formType == null || formType.isEmpty() ? "%" : formType, like, relateId);
    }

    private static List<Long> ids(List<Long> list) {
        return list == null ? List.of() : list;
    }

    /** 점검항목이 요청한 부서 책무매뉴얼의 것인지(등록 전 새 번호는 mustExist=false로 통과) */
    private void requireManl(UserPrincipal user, Long manlOrgId, Long manlId, boolean mustExist) {
        manlOrgService.requireScope(user, manlOrgId);
        Long owner = mapper.selectManlOrgIdByManlId(manlId);
        if (owner == null ? mustExist : !manlOrgId.equals(owner)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /**
     * AS-IS tdm.Tdm43_Manl.delete: 연결 법규·내규·양식(tdm45·46·47)과 첨부(sys11)를 지우고 점검항목을 지운다.
     * 요청한 부서 책무매뉴얼의 점검항목이 아니면(점검항목이 없는 관리의무 행의 번호 포함) 거절한다.
     */
    @Transactional
    public void delete(UserPrincipal user, Long manlOrgId, Long manlId) {
        manlOrgService.requireScope(user, manlOrgId);
        if (!manlOrgId.equals(mapper.selectManlOrgIdByManlId(manlId))) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        mapper.deleteRelateIcsByManlId(manlId);
        mapper.deleteRelateIcrByManlId(manlId);
        mapper.deleteRelateDcrByManlId(manlId);
        mapper.deleteRelateFileByParentId(manlId);
        mapper.deleteById(manlId);
    }

    /** AS-IS tdm.Tdm43_Manl.selectByManlDutyId (N17 아래 그리드) — 관리의무가 로그인 회사 것이어야 한다 */
    public List<ManlItemRes> searchByDuty(UserPrincipal user, Long manlDutyId, Long orgId) {
        requireDuty(user, manlDutyId);
        return mapper.selectByManlDutyId(manlDutyId, orgId);
    }

    /** AS-IS tdm.Tdm43_Manl.selectByRoleId (TabPage [불러오기] 조회창 위 그리드) — 로그인 회사. searchText는 '%글자%' */
    public List<ManlCopySourceRes> sourcesByRole(UserPrincipal user, Long roleId, Long taskId, Long orgId, String stdDate, boolean allYn, String searchText) {
        return mapper.selectByRoleId(user.getCompanyId(), roleId, taskId, orgId, stdDate, allYn, like(searchText));
    }

    /** AS-IS tdm.Tdm43_Manl.selectByManlJobId (본 화면 [불러오기] 조회창 위 그리드) — 작업이 로그인 회사 것이어야 한다 */
    public List<ManlCopySourceRes> sourcesByJob(UserPrincipal user, Long manlJobId, Long stdRoleId, Long stdOrgId, Long roleId, Long taskId, Long orgId,
                                                String stdDate, boolean allYn, String searchText) {
        Long jobCompanyId = jobMapper.selectCompanyId(manlJobId);
        if (jobCompanyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!jobCompanyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return mapper.selectByManlJobId(user.getCompanyId(), manlJobId, stdRoleId, stdOrgId, roleId, taskId, orgId, stdDate, allYn, like(searchText));
    }

    /** AS-IS tdm.Tdm43_Manl.selectByTaskRelateDutyId (조회창 아래 그리드) — 부서 책무매뉴얼의 회사로 범위를 검사한다 */
    public List<ManlCopyItemRes> sourceItems(UserPrincipal user, Long manlOrgId, Long taskRelateDutyId) {
        manlOrgService.requireScope(user, manlOrgId);
        return mapper.selectByTaskRelateDutyId(manlOrgId, taskRelateDutyId);
    }

    /**
     * AS-IS tdm.Tdm43_Manl.copyManlList — 고른 원본 점검항목을 관리의무(manlDutyId)에 복사한다. 연결 법규·내규·문서분류·양식도 같이.
     * 원본 부서가 같으면 같은 점검항목코드가 이미 있는지 먼저 본다(없을 때만 복사). 원본은 이 회사 것이어야 한다(원본에 없던 검사)
     */
    @Transactional
    public void copyManls(UserPrincipal user, ManlCopyReq req) {
        if (req.manlOrgId() == null || req.manlDutyId() == null || req.orgId() == null || req.manlIds() == null || req.manlIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = manlOrgService.requireScope(user, req.manlOrgId());
        if (!companyId.equals(dutyMapper.selectDutyCompanyId(req.manlDutyId()))) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        for (Long manlId : req.manlIds()) {
            ManlSourceRes src = mapper.selectSource(manlId);
            if (src == null || !companyId.equals(src.companyId())) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (req.orgId().equals(src.orgId()) && mapper.countByManlCode(req.manlOrgId(), src.manlCode()) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 등록되어 있는 점검항목입니다 (매뉴얼코드:" + src.manlCode() + ")");
            }
            Long newManlId = mapper.selectNextId();
            mapper.insertManlByManlId(req, newManlId, manlId, user.getUserId(), user.getName());
            copyRelates(newManlId, manlId);
        }
    }

    /**
     * AS-IS tdm.Tdm43_Manl.copyDutyList — 고른 원본 주요관리의무마다 그 점검항목을 이 작업·직책·부서의 같은 관리의무에 복사하고 그 관리의무를 작성완료로 한다.
     * 원본 부서가 다르면 점검항목코드를 새로 만들고, 같으면 같은 코드가 이미 있는지 본다
     */
    @Transactional
    public void copyDuties(UserPrincipal user, ManlCopyDutiesReq req) {
        if (req.manlJobId() == null || req.roleId() == null || req.orgId() == null || req.sources() == null || req.sources().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = jobMapper.selectCompanyId(req.manlJobId());
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        for (ManlCopyDutiesReq.Source src : req.sources()) {
            List<ManlCopyRow> rows = mapper.selectByDutyId(companyId, req.manlJobId(), req.roleId(), req.orgId(), src.manlOrgId(),
                    src.roleId(), src.orgId(), src.taskId(), src.taskRelateDetailId(), src.taskRelateDutyId(), user.getUserId());
            for (ManlCopyRow row : rows) {
                String manlCode;
                if (!req.orgId().equals(row.orgId())) {
                    manlCode = mapper.selectNewManlCode(row.companyId());
                } else {
                    if (mapper.countByManlCode(row.manlOrgId(), row.manlCode()) != 0) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 등록되어 있는 점검항목입니다 (매뉴얼코드:" + row.manlCode() + ")");
                    }
                    manlCode = row.manlCode();
                }
                Long newManlId = mapper.selectNextId();
                mapper.insertCopiedManl(row, newManlId, manlCode, req.orgId(), user.getUserId(), user.getName());
                copyRelates(newManlId, row.manlId());
                dutyMapper.updateDutyOrgEnd(row.manlDutyId(), req.orgId(), true, user.getUserId(), user.getName());
            }
        }
    }

    /** AS-IS tdm.Tdm43_Manl.delete 목록 버전 — 고른 점검항목을 한 트랜잭션에서 지운다 */
    @Transactional
    public void deleteAll(UserPrincipal user, Long manlOrgId, List<Long> manlIds) {
        if (manlIds == null || manlIds.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        manlIds.forEach(id -> delete(user, manlOrgId, id));
    }

    private void copyRelates(Long newManlId, Long manlId) {
        mapper.copyRelateIcs(newManlId, manlId);      // 연관법규
        mapper.copyRelateIcr(newManlId, manlId);      // 연관내규
        mapper.copyRelateDcr(newManlId, manlId);      // 연관문서분류
        mapper.copyRelateFile(newManlId, manlId);     // 연관양식
    }

    private void requireDuty(UserPrincipal user, Long manlDutyId) {
        Long companyId = dutyMapper.selectDutyCompanyId(manlDutyId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.isSysAdmin() && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }
}
