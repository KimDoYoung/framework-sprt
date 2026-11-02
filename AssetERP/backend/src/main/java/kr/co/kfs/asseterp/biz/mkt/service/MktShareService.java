package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktShareRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktShareSaveReq;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktShareMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Z05 Mkt05_Lookup_Share → server/mkt/Mkt05_Share.java (selectByParentId L21, selectShareInfo L26, insertDefaultShare L31, deleteDefaultShare L40, update L45, delete L50) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktShareService {

    private final MktShareMapper mapper;

    /** AS-IS mkt.Mkt05_Share.selectByParentId */
    public List<MktShareRes> search(UserPrincipal user, Long parentId) {
        return mapper.selectByParentId(user.getCompanyId(), parentId);
    }

    /** AS-IS mkt.Mkt05_Share.selectShareInfo — 공유 요약 글자(없으면 null) */
    public String shareInfo(Long parentId) {
        return mapper.selectShareInfo(parentId);
    }

    /** AS-IS mkt.Mkt05_Share.delete + update → selectShareInfo. 지울 행을 먼저 지우고 바뀐 행(shareId 0 이하는 새 행)을 넣는다 */
    @Transactional
    public String save(UserPrincipal user, MktShareSaveReq req) {
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.deleteByIds(user.getCompanyId(), req.deleteIds());
        }
        if (req.rows() != null) {
            for (MktShareRes row : req.rows()) {
                if (row.shareId() != null && row.shareId() > 0) {
                    if (mapper.updateOne(user.getCompanyId(), row) > 0) {
                        continue;
                    }
                }
                Long id = row.shareId() != null && row.shareId() > 0 ? row.shareId() : mapper.selectNextId();
                MktShareRes r = new MktShareRes(id, req.parentId(), row.shareCode(), row.personId(), row.orgId(), null, null, null);
                mapper.insertOne(user.getCompanyId(), req.parentId(), r);
            }
        }
        return mapper.selectShareInfo(req.parentId());
    }

    /** AS-IS mkt.Mkt05_Share.insertDefaultShare — 활동처의 공유 지정을 새 활동내역에 복사. 복사된 게 있을 때만 공유 요약을 돌려준다 */
    @Transactional
    public String insertDefault(UserPrincipal user, Long targetCompanyId, Long historyId) {
        int cnt = mapper.insertDefaultShare(user.getCompanyId(), historyId, targetCompanyId);
        return cnt > 0 ? mapper.selectShareInfo(historyId) : null;
    }

    /** AS-IS mkt.Mkt05_Share.deleteDefaultShare — 등록을 취소할 때 복사해 둔 공유 정보를 지운다 */
    @Transactional
    public void deleteDefault(UserPrincipal user, Long historyId) {
        mapper.deleteByParentId(user.getCompanyId(), historyId);
    }
}
