package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingSaveReq;
import kr.co.kfs.asseterp.biz.sch.mapper.SchIpoItemMatchingMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sch/Sch15_IpoItemMatching.java (selectByText L21 / update L26 / delete L31) — IPO 종목코드 매칭. 쓰기는 관리자 회사만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchIpoItemMatchingService {

    private final SchIpoItemMatchingMapper mapper;

    /** AS-IS retrieve() L138-150: 검색어는 "%검색어%" */
    public List<Sch15IpoItemMatchingRes> search(String searchText) {
        return mapper.selectByText("%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<Sch15IpoItemMatchingRes> update(UserPrincipal user, List<Sch15IpoItemMatchingSaveReq> rows) {
        requireAdminCompany(user);
        List<Sch15IpoItemMatchingRes> saved = new ArrayList<>();
        for (Sch15IpoItemMatchingSaveReq req : rows) {
            boolean isNew = req.ipoItemMatchingId() == null || req.ipoItemMatchingId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.ipoItemMatchingId();
            if (isNew) {
                mapper.insertMatching(id, req);
            } else if (mapper.updateMatching(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireAdminCompany(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteMatchings(ids);
    }

    private static void requireAdminCompany(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
