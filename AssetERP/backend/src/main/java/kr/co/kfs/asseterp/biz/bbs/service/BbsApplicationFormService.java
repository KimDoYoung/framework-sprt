package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationFormContentReq;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationFormRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationFormSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsApplicationFormMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Bbs12_Lookup_ApplicationMng → server/bbs/Bbs12_ApplicationForm.java (selectByCompanyId L27 / formCheck L35 / modelUpdate L82 / update L95) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsApplicationFormService {

    private final BbsApplicationFormMapper mapper;

    /** AS-IS open() → formCheck(없는 신청구분 양식을 공개여부 false로 만든다) 뒤 retrieve() */
    @Transactional
    public List<ApplicationFormRes> search(UserPrincipal user) {
        for (String code : mapper.selectMissingCodes(user.getCompanyId(), "ApplicationType")) {
            mapper.insertForm(mapper.selectNextId(), user.getCompanyId(), code);
        }
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS update → UpdateDataModel. 고친 행의 공개여부 */
    @Transactional
    public int update(UserPrincipal user, List<ApplicationFormSaveReq> rows) {
        int count = 0;
        for (ApplicationFormSaveReq req : rows) {
            if (mapper.updatePublicYn(user.getCompanyId(), req.applicationFormId(), Boolean.TRUE.equals(req.publicYn())) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            count++;
        }
        return count;
    }

    /** AS-IS modelUpdate — 선택한 양식의 내용·모바일 내용 */
    @Transactional
    public void updateContent(UserPrincipal user, Long applicationFormId, ApplicationFormContentReq req) {
        if (mapper.updateContent(user.getCompanyId(), applicationFormId, req.content(), req.contentMobi()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
