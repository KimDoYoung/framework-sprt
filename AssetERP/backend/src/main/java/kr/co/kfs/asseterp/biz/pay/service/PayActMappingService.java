package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayActMappingRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayActMappingSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayActMappingMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/pay/Pay06_ActMapping.java (selectByLinkCode L51 / update L77 / delete L82) — 계약서 Mapping */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayActMappingService {

    private final PayActMappingMapper mapper;

    /** AS-IS selectByLinkCode: 사원구분은 화면이 "%"(전체)로 부른다 */
    public List<PayActMappingRes> search(UserPrincipal user, String linkCode, String kindCode) {
        return mapper.selectByLinkCode(user.getCompanyId(), linkCode,
                kindCode == null || kindCode.isEmpty() ? "%" : kindCode);
    }

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고 없는 행은 새 ID로 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<PayActMappingRes> save(UserPrincipal user, List<PayActMappingSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (PayActMappingSaveReq req : rows) {
            if (req.title() == null || req.title().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "제목은 필수입력 항목입니다.");
            }
            if (req.linkCode() == null || req.linkCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "매뉴 코드가 없습니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.actMappingId() != null && req.actMappingId() > 0
                    && mapper.selectById(req.actMappingId(), companyId) != null;
            if (exists) {
                mapper.update(companyId, req);
                return mapper.selectById(req.actMappingId(), companyId);
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, companyId, req);
            return mapper.selectById(newId, companyId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
