package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.AddTitleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmAddTitleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 직무겸직(사내) (AS-IS server/tdm/Tdm03_AddTitle) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmAddTitleService {

    private final TdmAddTitleMapper mapper;

    /** AS-IS Tdm03_AddTitle.selectByPersonId */
    public List<AddTitleRes> search(UserPrincipal user, Long personId) {
        return mapper.selectByPersonId(user.getCompanyId(), personId);
    }

    /** AS-IS Tdm03_AddTitle.update → UpdateDataModel. ID null/≤0: INSERT, 그 밖: UPDATE. 저장한 행을 다시 읽어 요청 순서로 돌려준다 */
    @Transactional
    public List<AddTitleRes> save(UserPrincipal user, List<AddTitleSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> ids = new ArrayList<>();
        for (AddTitleSaveReq req : rows) {
            if (req.addTitleId() == null || req.addTitleId() <= 0) {
                Long newId = mapper.selectNextId();
                mapper.insertAddTitle(newId, companyId, req, user.getName());
                ids.add(newId);
            } else {
                if (mapper.updateAddTitle(companyId, req, user.getName()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                ids.add(req.addTitleId());
            }
        }
        return ids.stream().map(mapper::selectById).toList();
    }

    /** AS-IS Tdm03_AddTitle.delete → UpdateDataModel.deleteModel */
    @Transactional
    public int delete(UserPrincipal user, List<Long> addTitleIds) {
        if (addTitleIds == null || addTitleIds.isEmpty()) return 0;
        return mapper.deleteAddTitles(addTitleIds, user.getCompanyId());
    }
}
