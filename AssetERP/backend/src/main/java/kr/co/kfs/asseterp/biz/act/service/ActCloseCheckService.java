package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.CloseCheckRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseCheckSaveReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActCloseCheckMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/act/Act15_CloseCheck.java (selectByText L24 / update L30).
 * 화면이 모든 고객사를 한 번에 보여 주는 관리자 표라 저장은 관리자 회사만 한다(보안 보강, E21·E23과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActCloseCheckService {

    private final ActCloseCheckMapper mapper;

    /** AS-IS Act15_Tab_CloseCheck.retrieve() L112-128: 고객사명 "%검색어%" */
    public List<CloseCheckRes> search(String searchText) {
        return mapper.selectByText("%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS update(UpdateDataModel): selectById가 비면(아직 행이 없는 고객사의 임시 ID) 새 시퀀스로 INSERT, 있으면 UPDATE
     * → 저장된 행(요청 순서). 화면은 끝나면 다시 조회한다
     */
    @Transactional
    public List<CloseCheckRes> save(UserPrincipal user, List<CloseCheckSaveReq> rows) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<CloseCheckRes> saved = new ArrayList<>();
        for (CloseCheckSaveReq req : rows) {
            boolean exists = req.closeCheckId() != null && mapper.selectById(req.closeCheckId()) != null;
            Long id = req.closeCheckId();
            if (exists) {
                mapper.update(req);
            } else {
                if (req.companyId() == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "고객사 정보가 없습니다.");
                }
                id = mapper.selectNextId();
                mapper.insert(id, req);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }
}
