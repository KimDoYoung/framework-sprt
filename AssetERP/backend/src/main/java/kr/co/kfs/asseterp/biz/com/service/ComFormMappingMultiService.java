package kr.co.kfs.asseterp.biz.com.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingMultiRes;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingMultiSaveReq;
import kr.co.kfs.asseterp.biz.com.mapper.ComFormMappingMultiMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/com/Com11_FormMappingMulti.java (getUpdateModel L59 / modelUpdate L89) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComFormMappingMultiService {

    private final ComFormMappingMultiMapper mapper;

    /**
     * AS-IS getUpdateModel: 저장된 양식이 있으면 그것, 없으면 새 번호(getSeq)만 채운 빈 양식을 돌려준다(DB에는 쓰지 않는다).
     * 새 번호는 시퀀스(nextval)를 쓰므로 읽기 전용 트랜잭션에서는 돌지 않는다 — 쓰기 트랜잭션으로 연다
     */
    @Transactional
    public FormMappingMultiRes get(UserPrincipal user, String kindCode, String detailCode, String linkCode) {
        FormMappingMultiRes res = mapper.selectByDetailCode(user.getCompanyId(), kindCode, detailCode, linkCode);
        if (res != null) {
            return res;
        }
        return new FormMappingMultiRes(mapper.selectNextId(), user.getCompanyId(), kindCode, detailCode, linkCode, null, null);
    }

    /** AS-IS modelUpdate: 번호가 없으면 새 번호, DB에 없으면 INSERT(회사 = 로그인 회사), 있으면 내용만 UPDATE → 양식 번호 */
    @Transactional
    public Long update(UserPrincipal user, FormMappingMultiSaveReq req) {
        Long id = req.formMappingMultiId() == null ? mapper.selectNextId() : req.formMappingMultiId();
        Long companyId = mapper.selectCompanyIdById(id);
        if (companyId == null) {
            mapper.insertFormMappingMulti(id, user.getCompanyId(), req);
        } else {
            if (!user.getCompanyId().equals(companyId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            mapper.updateContent(id, req.content());
        }
        return id;
    }
}
