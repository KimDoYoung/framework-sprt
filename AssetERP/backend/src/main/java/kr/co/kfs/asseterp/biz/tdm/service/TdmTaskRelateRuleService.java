package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskRelateRuleAddReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskRelateRuleRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmTaskRelateRuleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/tdm/Tdm11_TaskRelateRule.java (selectBySearchText · update L35 · delete L59) — 직무 연관규정 매핑 창 Tdm11_Lookup_TaskRelateRule (EE43) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmTaskRelateRuleService {

    private final TdmTaskRelateRuleMapper mapper;

    /** retrieve() L222-238: 구분(relateType '%' 전체 / '1' 법규 / '2' 내규)·검색어(규정명/규정코드에 든 글자) */
    public List<TaskRelateRuleRes> search(UserPrincipal user, Long taskId, String relateType, String searchText) {
        checkTask(user, taskId);
        return mapper.selectBySearchText(user.getCompanyId(), taskId,
                relateType == null || relateType.isEmpty() ? "%" : relateType, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** update() L35-57: 이미 연결된 규정(같은 책무·구분·코드)은 건너뛰고 나머지를 넣는다 → 넣은 건수 */
    @Transactional
    public int add(UserPrincipal user, List<TaskRelateRuleAddReq> rows) {
        int count = 0;
        for (TaskRelateRuleAddReq r : rows) {
            checkTask(user, r.taskId());
            if (r.relateType() == null || r.ruleCode() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "규정이 올바르지 않습니다");
            if (mapper.countUseByRuleCode(-1L, r.taskId(), r.relateType(), r.ruleCode()) > 0) continue;
            count += mapper.insertRule(mapper.selectNextId(), user.getCompanyId(), r.taskId(), r.relateType(), r.ruleCode(), user.getName());
        }
        return count;
    }

    /** delete() L59-62: 로그인 회사의 연결만 지운다 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return mapper.deleteRules(user.getCompanyId(), ids);
    }

    private void checkTask(UserPrincipal user, Long taskId) {
        if (taskId == null || mapper.countTask(user.getCompanyId(), taskId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
    }
}
