package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeUpdateReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrDocTypeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/dcr/Dcr05_DocType.java (selectByName L31 / updateEdit L128) — 문서양식 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrDocTypeService {

    private final DcrDocTypeMapper mapper;

    /** AS-IS selectByName: 검색어(없으면 %)는 "%…%", 구분(없으면 %) */
    public List<DcrDocTypeRes> search(UserPrincipal user, String searchText, String formClassCode) {
        String title = searchText == null ? "%" : "%" + searchText + "%";
        String formClass = formClassCode == null || formClassCode.isEmpty() ? "%" : formClassCode;
        return mapper.selectByName(user.getCompanyId(), title, formClass);
    }

    /** AS-IS updateEdit(UpdateDataModel): 구분·제목·내용은 화면이 검사하지만 제목·내용은 NOT NULL이라 서버도 막는다 → 저장된 행 */
    @Transactional
    public DcrDocTypeRes update(UserPrincipal user, Long docTypeId, DcrDocTypeUpdateReq req) {
        if (req.docFormClassCode() == null || req.docFormClassCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "구분은 필수선택 항목입니다");
        }
        if (req.title() == null || req.title().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "제목은 필수입력 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "내용은 필수입력 항목입니다");
        }
        if (mapper.updateEdit(user.getCompanyId(), docTypeId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(docTypeId, user.getCompanyId());
    }
}
