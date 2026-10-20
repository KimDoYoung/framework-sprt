package kr.co.kfs.asseterp.biz.icr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleRes;
import kr.co.kfs.asseterp.biz.icr.mapper.IcrClassTreeMapper;
import kr.co.kfs.asseterp.biz.icr.mapper.IcrRelateManagerMapper;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsManagerMapper;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsRelateManagerMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/icr/Icr05_RelateManager.java (selectByClassTreeId L27 / relateUpdate L36) — H09 Icr01_Lookup_Share */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcrRelateManagerService {

    private final IcrRelateManagerMapper mapper;
    private final IcsManagerMapper managerMapper;
    private final IcsRelateManagerMapper shareMapper;
    private final IcrClassTreeMapper classTreeMapper;

    /**
     * Icr01_Lookup_Share.retrieve L76-112: 내규에 연결된 관리그룹. 없으면 미지정 관리그룹(ics02_manager.getDefaultYn).
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
     * AS-IS Icr05_RelateManager.relateUpdate L36-63: 내규의 연결을 지우고 관리그룹으로 다시 연결한 뒤, 내규 공유(sch02_share)를 그 관리그룹의
     * 공유(ics04_share)로 채우고 내규 한 행(icr01_class_tree.refresh)을 돌려준다.
     * AS-IS는 공유를 지우는 `sch02_share.delete`에 `icrClassTreeId`를 넘기는데 그 SQL은 `icsClassTreeId`를 받아 아무것도 지우지 않는다 —
     * 그대로 옮겨 저장할 때마다 공유가 늘어난다(작업기록 제안). 관리그룹·내규가 이 회사 것인지 확인한다(AS-IS에는 없음)
     */
    @Transactional
    public IcrRuleRes relateUpdate(UserPrincipal user, Long managerId, Long classTreeId) {
        Long companyId = user.getCompanyId();
        if (managerId == null || managerMapper.selectById(companyId, managerId) == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "관리그룹을 선택하세요");
        }
        if (classTreeId == null || classTreeMapper.countById(companyId, classTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        mapper.deleteByClassTreeId(companyId, classTreeId);
        mapper.insert(companyId, classTreeId, managerId);
        for (IcsShareRes share : managerMapper.selectSharesByManagerId(companyId, managerId)) {
            shareMapper.insertShare(classTreeId, share.companyId(), share.shareCode(), share.personId(), share.orgId());
        }
        return classTreeMapper.selectRuleRefresh(companyId, classTreeId);
    }
}
