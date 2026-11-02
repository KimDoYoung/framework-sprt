package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktManagerMoveReq;
import kr.co.kfs.asseterp.biz.mkt.dto.MktManagerRes;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktManagerMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** Z05 Mkt01_Lookup_TargetCompany·Mkt01_Lookup_SelectCompany → server/mkt/Mkt02_Manager.java (selectByTargetCompanyId L25, updateTargetCompanyId L30, update L51, delete L56) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktManagerService {

    private final MktManagerMapper mapper;

    /** AS-IS mkt.Mkt02_Manager.selectByTargetCompanyId */
    public List<MktManagerRes> search(UserPrincipal user, Long targetCompanyId) {
        return mapper.selectByTargetCompanyId(user.getCompanyId(), targetCompanyId);
    }

    /** AS-IS mkt.Mkt02_Manager.update(UpdateDataModel: managerId가 이미 있으면 UPDATE, 아니면 INSERT) → 요청 순서대로 selectById */
    @Transactional
    public List<MktManagerRes> save(UserPrincipal user, List<MktManagerRes> rows) {
        List<MktManagerRes> result = new ArrayList<>();
        for (MktManagerRes row : rows) {
            Long id = row.managerId() == null || row.managerId() <= 0 ? mapper.selectNextId() : row.managerId();
            MktManagerRes r = new MktManagerRes(id, row.targetCompanyId(), row.managerName(), row.orgName(), row.posName(),
                    row.tel(), row.emailAddr(), row.note(), row.retireInfo());
            if (mapper.updateOne(user.getCompanyId(), r) == 0) {
                if (r.targetCompanyId() == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "활동처 ID가 없습니다.");
                }
                mapper.insertOne(user.getCompanyId(), r);
            }
            result.add(mapper.selectById(user.getCompanyId(), id));
        }
        return result;
    }

    /** AS-IS mkt.Mkt02_Manager.delete — 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /** AS-IS mkt.Mkt02_Manager.updateTargetCompanyId — 담당자가 없으면 원본이 status -1 */
    @Transactional
    public int move(UserPrincipal user, MktManagerMoveReq req) {
        if (req.managerIds() == null || req.managerIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 담당자가 없습니다");
        }
        return mapper.updateTargetCompanyId(user.getCompanyId(), req.targetCompanyId(), req.managerIds());
    }
}
