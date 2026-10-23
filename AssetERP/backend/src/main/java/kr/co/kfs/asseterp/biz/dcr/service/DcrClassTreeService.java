package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeNoteRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrAdminTreeRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCheckRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCheckRowReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeAllRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCopyCompanyRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCopyReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRowRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrUseYnReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrWriteTreeRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrClassTreeMapper;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/dcr/Dcr01_ClassTree.java (commentInsert L451, selectByText L40 — E13-3;
 * selectByCompanyId L50, selectByAll L73, selectByClassTreeId L202, updateCheck L288, insertAdminCopy L349, update L410, deleteCheck L415, deleteAll L452 — E16)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrClassTreeService {

    /** AS-IS Dcr01_Lookup_SelectMulti.retrieve: 문서분류 구분은 'T' */
    private static final String TYPE_CODE = "T";

    private final DcrClassTreeMapper mapper;
    private final EmpTransInfoService transInfoService;

    /**
     * AS-IS selectByText: 사용 중인 문서분류(T) 중 분류코드+문서분류명에 검색어가 든 것.
     * relateTable "TDM47"(책무매뉴얼 점검항목 연결 문서분류, Tdm43_Page_Relate)이면 그 점검항목에 아직 연결 안 된 것만(E13-3)
     */
    public List<ClassTreeLookupRes> searchLookup(UserPrincipal user, String searchText, String relateTable, Long relateId) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectLookup(user.getCompanyId(), TYPE_CODE, like, relateTable, relateId);
    }

    /** AS-IS commentInsert L451-463: admin(0) 문서분류 중 개요가 있는 것을 같은 구분코드로 대상 회사에 덮어쓴다 → 바뀐 행 수 */
    @Transactional
    public int copyCommentsFromAdmin(UserPrincipal user, Long companyId) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        int updated = 0;
        for (ClassTreeNoteRow admin : mapper.selectNotesByCompany(0L)) {
            updated += mapper.updateNote(new ClassTreeNoteRow(companyId, admin.classTreeCode(), admin.note()));
        }
        return updated;
    }

    // ===== E16 =====

    /** AS-IS selectByCompanyId: 로그인 회사의 사용 중인 분류 트리(전위 순서 평평한 목록). typeCode는 'C'(문서분류)·'%'(문서구분 포함) */
    public List<DcrClassTreeRes> searchTree(UserPrincipal user, String typeCode) {
        return searchTree(user, typeCode, null);
    }

    /** E17 Dcr30_Move_DcrClass.openNull(companyId, …): 고른 회사의 트리. 다른 회사는 관리자 회사만 */
    public List<DcrClassTreeRes> searchTree(UserPrincipal user, String typeCode, Long companyId) {
        Long target = user.getCompanyId();
        if (companyId != null && !companyId.equals(target)) {
            requireSysAdmin(user);
            target = companyId;
        }
        return mapper.selectTree(target, typeCode == null || typeCode.isEmpty() ? "C" : typeCode);
    }

    /** AS-IS selectByOrgIdRoleWrite (F02): 로그인 사용자의 조직이 작성권한을 가진 분류 트리(전위 순서 평평한 목록). 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    public List<DcrWriteTreeRes> searchWriteTree(UserPrincipal user) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectWriteTree(user.getCompanyId(), orgId, user.getUserId());
    }

    /**
     * AS-IS dcr.Dcr03_OrgAuth.selectByDcrOrgId (L06 Dcr30_Move_DcrClass.update 의 일반 사용자 권한 검사 L168-209).
     * 조직(LoginUser.getOrgCodeId())의 문서분류 수정권한이 있으면(첫 행 update_yn 'true') true, 행이 없거나 아니면 false. 관리자는 검사하지 않으므로 화면이 부르지 않는다
     */
    public boolean hasUpdateAuth(UserPrincipal user, Long classTreeId) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        List<String> yn = mapper.selectOrgAuthUpdateYn(orgId, classTreeId);
        return !yn.isEmpty() && "true".equals(yn.get(0));
    }

    /** AS-IS selectByAll: 사용 여부와 관계없는 전체 트리 + 문서구분별 상신문서 건수 (Dcr01_Lookup_UseYn) */
    public List<DcrClassTreeAllRes> searchTreeAll(UserPrincipal user, String typeCode) {
        return mapper.selectTreeAll(user.getCompanyId(), typeCode == null || typeCode.isEmpty() ? "%" : typeCode);
    }

    /** AS-IS selectByClassTreeId: 고른 분류 아래의 문서구분(T). 검색어는 "%…%"(비면 조건 없음) */
    public List<DcrDocTypeRowRes> searchDocTypes(UserPrincipal user, Long parentId, String searchText) {
        String like = searchText == null || searchText.isEmpty() ? null : "%" + searchText + "%";
        return mapper.selectDocTypes(user.getCompanyId(), parentId, like);
    }

    /** AS-IS update(UpdateDataModel) 새 문서분류(C): 회사 = 로그인 회사, 유형 C, 사용 true, 관리자 회사면 adminYn true. id는 저장 때 채번 */
    @Transactional
    public DcrClassTreeRes createClassTree(UserPrincipal user, DcrClassTreeSaveReq req) {
        checkClassTree(req);
        long id = mapper.selectNextId();
        mapper.insertClassTree(id, user.getCompanyId(), adminYn(user), req);
        return mapper.selectTreeRowById(id);
    }

    /** AS-IS update(UpdateDataModel) 수정. 로그인 회사 행이 아니면 없는 분류로 본다 */
    @Transactional
    public DcrClassTreeRes updateClassTree(UserPrincipal user, Long classTreeId, DcrClassTreeSaveReq req) {
        checkClassTree(req);
        if (mapper.updateClassTree(user.getCompanyId(), classTreeId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectTreeRowById(classTreeId);
    }

    /** AS-IS Dcr01_Move_TreeGrid·Move_Grid.moveTree: 상위 분류만 바꾼다 */
    @Transactional
    public DcrClassTreeRes moveParent(UserPrincipal user, Long classTreeId, Long parentTreeId) {
        if (parentTreeId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상위 문서분류를 선택해주세요");
        }
        if (mapper.updateParent(user.getCompanyId(), classTreeId, parentTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectTreeRowById(classTreeId);
    }

    /** AS-IS Dcr01_Lookup_UseYn.update: 바뀐 행의 사용 여부 → 바뀐 건수 */
    @Transactional
    public int updateUseYn(UserPrincipal user, List<DcrUseYnReq> rows) {
        int count = 0;
        for (DcrUseYnReq r : rows) {
            count += mapper.updateUseYn(user.getCompanyId(), r.classTreeId(), r.useYn());
        }
        return count;
    }

    /** AS-IS Dcr01_Grid_DocType.update(UpdateDataModel): 새 행(임시 ID 0 이하)은 INSERT, 아니면 UPDATE → 저장된 행(요청 순서) */
    @Transactional
    public List<DcrDocTypeRowRes> saveDocTypes(UserPrincipal user, List<DcrDocTypeSaveReq> rows) {
        List<DcrDocTypeRowRes> saved = new ArrayList<>();
        for (DcrDocTypeSaveReq req : rows) {
            boolean isNew = req.classTreeId() == null || req.classTreeId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.classTreeId();
            if (isNew) {
                mapper.insertDocType(id, user.getCompanyId(), adminYn(user), req);
            } else if (mapper.updateDocType(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectDocTypeById(id));
        }
        return saved;
    }

    /** AS-IS updateCheck L288-: 첫 위반 문구가 status -1, 없으면 1 */
    public DcrCheckRes updateCheck(UserPrincipal user, List<DcrCheckRowReq> rows) {
        String validMsg = null;
        for (DcrCheckRowReq r : rows) {
            if (user.getCompanyId() == 0L) {
                List<DcrAdminTreeRow> same = mapper.selectAdminByCode(r.classTreeCode());
                if (!same.isEmpty() && !same.get(0).classTreeId().equals(r.classTreeId())) {
                    validMsg = "동일한 구분코드(" + r.classTreeCode() + " " + same.get(0).classTreeName() + ")가 존재합니다.";
                    break;
                }
            } else {
                // 관리자가 내려준 분류는 화면 값이 저장된 값과 같아야 한다 (AS-IS는 모델의 adminYn, 여기선 저장된 행 — 새 행은 내려준 분류가 아니다)
                DcrAdminTreeRow def = r.classTreeId() == null ? null : mapper.selectCheckRow(r.classTreeId());
                if (def != null && "true".equals(def.adminYn())) {
                    String note1 = r.note() == null ? "null" : r.note();
                    String note2 = def.note() == null ? "null" : def.note();
                    boolean same = r.classTreeCode() != null && r.classTreeCode().equals(def.classTreeCode())
                            && note1.equals(note2)
                            && r.classTreeName() != null && r.classTreeName().equals(def.classTreeName())
                            && r.seq() != null && r.seq().equals(def.seq());
                    if (!same) {
                        validMsg = "'Asset-ERP'에서 제공하는 문서분류는 변경불가능합니다";
                        break;
                    }
                }
            }
        }
        return validMsg != null ? new DcrCheckRes(-1, validMsg) : new DcrCheckRes(1, null);
    }

    /**
     * AS-IS deleteCheck L415-: status = 문서분류지정 건수 + 상신문서 건수.
     * 메시지는 원본 그대로 — 둘 다 있으면 "N건의 문서분류지정, M건의 상신문서", 상신문서만 있으면 "continue", 그 밖에는 "N건의 문서분류지정, "
     * (원본은 `msg != null`이 항상 참이라 ", "가 항상 붙는다)
     */
    public DcrCheckRes deleteCheck(Long classTreeId) {
        int links = mapper.countLinks(classTreeId);
        int apprs = mapper.countApprs(classTreeId);
        String msg = "";
        if (links > 0) {
            msg += links + "건의 문서분류지정";
        }
        msg += ", ";
        if (apprs > 0) {
            msg += apprs + "건의 상신문서";
        }
        String message = apprs > 0 && links == 0 ? "continue" : msg;
        return new DcrCheckRes(apprs + links, message);
    }

    /**
     * AS-IS deleteAll L452-: 고른 분류와 아래 전체를 지운다 — 분류마다 상신문서를 폐기문서(apr99)로 옮기고 지운 뒤, 삭제 이력(dcr99)을 남기고 분류를 지운다.
     * 로그인 회사의 분류만 지울 수 있다(보안 보강, 05 §6)
     */
    @Transactional
    public int delete(UserPrincipal user, Long classTreeId) {
        DcrClassTreeRes root = mapper.selectTreeRowById(classTreeId);
        if (root == null || !user.getCompanyId().equals(root.companyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        Long empId = user.getUserId();
        int deleted = 0;
        for (Long id : mapper.selectDownTreeIds(classTreeId)) {
            for (Long apprId : mapper.selectApprIds(id)) {
                mapper.insertApprDel(apprId, empId);
                mapper.deleteAppr(apprId);
            }
            mapper.insertDcrDel(id, empId);
            deleted += mapper.deleteByClassTreeId(id);
        }
        return deleted;
    }

    /** AS-IS sys01_company.selectByUseYn (Dcr01_Lookup_DcrCopyAdmin 오른쪽 그리드) — 관리자 회사만 */
    public List<DcrCopyCompanyRes> copyCompanies(UserPrincipal user) {
        requireSysAdmin(user);
        return mapper.selectCopyCompanies();
    }

    /**
     * AS-IS insertAdminCopy L349-: admin(0) 문서분류 트리(고른 분류와 조상)를 고른 회사마다 반영한다 — 없으면 INSERT, 있으면 UPDATE.
     * 문서구분(T)이고 회사의 내부통제 가이드 사용(icsGuideYn)이면 연관 내부통제도 지우고 다시 만든다 → 반영한 회사 수
     */
    @Transactional
    public int insertAdminCopy(UserPrincipal user, DcrCopyReq req) {
        requireSysAdmin(user);
        if (req.dcrClassTreeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "문서분류를 선택해주세요");
        }
        List<DcrAdminTreeRow> stdList = mapper.selectAdminTree(req.dcrClassTreeId());
        List<Long> chosen = req.companyIds() == null ? List.of() : req.companyIds();
        int count = 0;
        for (DcrCopyCompanyRes company : mapper.selectCopyCompanies()) {
            if (!chosen.contains(company.companyId())) {
                continue;
            }
            for (DcrAdminTreeRow std : stdList) {
                if (mapper.countByInsertBak(company.companyId(), std.classTreeId()) == 0) {
                    mapper.insertAdminTree(company.companyId(), std.classTreeId());
                } else {
                    mapper.updateAdminTree(company.companyId(), std.classTreeId(), std);
                }
                if ("T".equals(std.typeCode()) && "true".equals(company.icsGuideYn())) {
                    mapper.deleteRelateIcsByInsertBak(company.companyId(), std.classTreeId());
                    mapper.insertRelateIcsByInsertBak(company.companyId(), std.classTreeId());
                }
            }
            count++;
        }
        return count;
    }

    /** 로그인 회사의 AssetERP 상품코드(S1/S2/S3/A1) — 사용여부설정 버튼을 S1에서는 숨긴다 */
    public String erpProductCode(UserPrincipal user) {
        return mapper.selectErpProductCode(user.getCompanyId());
    }

    private static String adminYn(UserPrincipal user) {
        return user.getCompanyId() == 0L ? "true" : "false";
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** NOT NULL 열인데 AS-IS 화면이 검사하지 않는 분류코드는 DB 오류 대신 안내로 막는다(05 §6 DB 오류) */
    private static void checkClassTree(DcrClassTreeSaveReq req) {
        if (req.classTreeName() == null || req.classTreeName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "업무명은 필수입력 항목입니다");
        }
        if (req.seq() == null || req.seq().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조회순서는 필수입력 항목입니다");
        }
        if (req.classTreeCode() == null || req.classTreeCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류코드는 필수입력 항목입니다");
        }
    }
}
