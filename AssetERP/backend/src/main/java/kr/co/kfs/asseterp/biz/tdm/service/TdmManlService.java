package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlFormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelatesRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlSaveReq;
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
}
