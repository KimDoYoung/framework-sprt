package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypePushReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeUpdateReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrDocTypeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/dcr/Dcr05_DocType.java (selectByName L31 / checkDocFormClassCode L104 / update L113 / updateEdit L128 / pushData L139 / delete L163) — 문서양식 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrDocTypeService {

    private final DcrDocTypeMapper mapper;

    /** AS-IS selectByName: 검색어(없으면 %)는 "%…%", 구분(없으면 %). 회사는 로그인 회사(KFS 관리자만 다른 회사를 고른다 — 문서양식등록의 고객사 칸) */
    public List<DcrDocTypeRes> search(UserPrincipal user, String searchText, String formClassCode, Long companyId) {
        String title = searchText == null ? "%" : "%" + searchText + "%";
        String formClass = formClassCode == null || formClassCode.isEmpty() ? "%" : formClassCode;
        return mapper.selectByName(user.companyOf(companyId), title, formClass);
    }

    /** AS-IS updateEdit(UpdateDataModel): 구분·제목·내용은 화면이 검사하지만 제목·내용은 NOT NULL이라 서버도 막는다 → 저장된 행 */
    @Transactional
    public DcrDocTypeRes update(UserPrincipal user, Long docTypeId, DcrDocTypeUpdateReq req, Long companyId) {
        validate(req);
        Long company = user.companyOf(companyId);
        if (mapper.updateEdit(company, docTypeId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(docTypeId, company);
    }

    private void validate(DcrDocTypeUpdateReq req) {
        if (req.docFormClassCode() == null || req.docFormClassCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "구분은 필수선택 항목입니다");
        }
        if (req.title() == null || req.title().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "제목은 필수입력 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "내용은 필수입력 항목입니다");
        }
    }

    /** AS-IS Dcr05_Edit_DocType.update → Dcr05_DocType.update: 새 ID(getSeq)로 로그인 회사에 INSERT → 저장된 행 */
    @Transactional
    public DcrDocTypeRes create(UserPrincipal user, DcrDocTypeUpdateReq req) {
        validate(req);
        Long docTypeId = mapper.selectNextId();
        mapper.insert(docTypeId, user.getCompanyId(), req);
        return mapper.selectById(docTypeId, user.getCompanyId());
    }

    /** AS-IS delete: 문서분류(dcr06)로 지정된 양식이 하나라도 있으면 아무것도 지우지 않는다 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, List<Long> ids) {
        for (Long id : ids) {
            if (mapper.countRelate(id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "문서분류 지정된 양식이 포함되어 있습니다.");
            }
        }
        return ids.isEmpty() ? 0 : mapper.deleteByIds(user.companyOf(companyId), ids);
    }

    /** AS-IS pushData: 고른 양식을 목적지 회사에 새 ID로 복사 (제목·내용·비고·구분). 화면은 관리자(isManager)에게만 버튼을 보인다 */
    @Transactional
    public int pushData(UserPrincipal user, DcrDocTypePushReq req) {
        if (user.getRoles() == null || !user.getRoles().contains("ROLE_ADMIN")) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (req.docTypeIds() == null || req.docTypeIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 내역이 없습니다.");
        }
        Long source = user.companyOf(req.sourceCompanyId());
        int count = 0;
        for (Long id : req.docTypeIds()) {
            DcrDocTypeRes src = mapper.selectById(id, source);
            if (src == null || !source.equals(src.companyId())) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            mapper.insert(mapper.selectNextId(), req.targetCompanyId(),
                    new DcrDocTypeUpdateReq(src.title(), src.content(), src.note(), src.docFormClassCode()));
            count++;
        }
        return count;
    }

    /** AS-IS checkDocFormClassCode: 이 구분 코드를 쓰는 양식이 있으면 거절 (Sys09_Lookup_Code 삭제 검사) */
    public void checkDocFormClassCode(UserPrincipal user, String docFormClassCode) {
        if (mapper.checkDocFormClassCode(user.getCompanyId(), docFormClassCode) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 코드는 삭제 불가합니다");
        }
    }
}
