package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawManageRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsClassTreeMapper;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsManagerMapper;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsRelateManagerMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/ics/Ics05_RelateManager.java (selectByClassTreeId L28 / relateUpdate L37) — H08 Ics01_Lookup_Share */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsRelateManagerService {

    private final IcsRelateManagerMapper mapper;
    private final IcsManagerMapper managerMapper;
    private final IcsClassTreeMapper classTreeMapper;

    /**
     * Ics01_Lookup_Share.retrieve L95-131: 법규에 연결된 관리그룹. 없으면 미지정 관리그룹(ics02_manager.getDefaultYn).
     * 둘 다 없으면 AS-IS는 클라이언트에서 오류가 난다 — 여기서는 "미지정 관리그룹이 없습니다"
     */
    public IcsManagerRes getByClassTree(UserPrincipal user, Long classTreeId) {
        List<IcsManagerRes> related = mapper.selectByClassTreeId(user.getCompanyId(), classTreeId);
        if (!related.isEmpty()) {
            return related.get(0);
        }
        IcsManagerRes def = managerMapper.selectDefault(user.getCompanyId());
        if (def == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "미지정 관리그룹이 없습니다.");
        }
        return def;
    }

    /**
     * AS-IS Ics05_RelateManager.relateUpdate L37-79: 고른 법규마다 연결을 지우고 관리그룹으로 다시 연결하고, 법규 공유(sch02_share)를 그 관리그룹의
     * 공유(ics04_share)로 바꾼 뒤 법규관리 한 행(ics01_class_tree.refresh)을 모아 돌려준다. 관리그룹이 이 회사 것인지 확인한다(AS-IS에는 없음)
     */
    @Transactional
    public List<IcsLawManageRes> relateUpdate(UserPrincipal user, Long managerId, List<Long> classTreeIds) {
        Long companyId = user.getCompanyId();
        if (managerId == null || managerMapper.selectById(companyId, managerId) == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "관리그룹을 선택하세요");
        }
        List<IcsLawManageRes> result = new ArrayList<>();
        for (Long classTreeId : classTreeIds) {
            mapper.deleteByClassTreeId(companyId, classTreeId);
            mapper.insert(companyId, classTreeId, managerId);

            mapper.deleteShare(companyId, classTreeId);
            for (IcsShareRes share : managerMapper.selectSharesByManagerId(companyId, managerId)) {
                mapper.insertShare(classTreeId, share.companyId(), share.shareCode(), share.personId(), share.orgId());
            }
            result.add(classTreeMapper.selectLawManageById(classTreeId, companyId));
        }
        return result;
    }
}
