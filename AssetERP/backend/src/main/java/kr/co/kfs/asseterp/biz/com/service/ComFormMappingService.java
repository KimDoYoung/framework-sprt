package kr.co.kfs.asseterp.biz.com.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingRes;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingSaveReq;
import kr.co.kfs.asseterp.biz.com.mapper.ComFormMappingMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/com/Com10_FormMapping.java (selectById L20 / modelUpdate L46) — 다른 회사의 양식은 관리자 회사만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComFormMappingService {

    private final ComFormMappingMapper mapper;

    /** AS-IS selectById: 없으면 null(화면이 새 양식으로 연다) */
    public FormMappingRes get(UserPrincipal user, Long formMappingId) {
        FormMappingRes res = mapper.selectById(formMappingId);
        if (res != null) {
            checkCompany(user, res.companyId());
        }
        return res;
    }

    /**
     * AS-IS modelUpdate: 번호가 없으면 새 번호(회사 = 로그인 회사)로 INSERT, 있으면 내용만 UPDATE.
     * linkId가 있으면 그 Link에 양식을 연결한다 → 양식 번호
     */
    @Transactional
    public Long update(UserPrincipal user, FormMappingSaveReq req) {
        Long formMappingId = req.formMappingId();
        boolean isNew = formMappingId == null || mapper.selectCompanyIdById(formMappingId) == null;
        if (!isNew) {
            checkCompany(user, mapper.selectCompanyIdById(formMappingId));
        }
        if (req.linkId() != null) {
            Long linkCompany = mapper.selectLinkCompanyId(req.linkId());
            if (linkCompany == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            checkCompany(user, linkCompany);
        }
        if (isNew) {
            formMappingId = formMappingId == null ? mapper.selectNextId() : formMappingId;
        }
        if (req.linkId() != null) {
            mapper.updateFormMappingId(req.linkId(), formMappingId);
        }
        if (isNew) {
            mapper.insertFormMapping(formMappingId, user.getCompanyId(), req.content());
        } else {
            mapper.updateContent(formMappingId, req.content());
        }
        return formMappingId;
    }

    private void checkCompany(UserPrincipal user, Long companyId) {
        if (!user.getCompanyId().equals(companyId) && !user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
