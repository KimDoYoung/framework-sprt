package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpSaveReq;
import kr.co.kfs.asseterp.biz.sch.mapper.SchIpoCorpMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sch/Sch12_IpoCorp.java (selectBySearchText L23 / update L57 / delete L62) — 주간사. 쓰기는 관리자 회사만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchIpoCorpService {

    private final SchIpoCorpMapper mapper;

    /** AS-IS retrieve() L136-154: 검색어는 "%검색어%"(없으면 %) */
    public List<Sch12IpoCorpRes> search(String searchText) {
        return mapper.selectBySearchText("%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<Sch12IpoCorpRes> update(UserPrincipal user, List<Sch12IpoCorpSaveReq> rows) {
        requireAdminCompany(user);
        List<Sch12IpoCorpRes> saved = new ArrayList<>();
        for (Sch12IpoCorpSaveReq req : rows) {
            boolean isNew = req.ipoCorpId() == null || req.ipoCorpId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.ipoCorpId();
            if (isNew) {
                mapper.insertIpoCorp(id, req);
            } else if (mapper.updateIpoCorp(req) == 0) {
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
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteIpoCorps(ids);
    }

    private static void requireAdminCompany(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
