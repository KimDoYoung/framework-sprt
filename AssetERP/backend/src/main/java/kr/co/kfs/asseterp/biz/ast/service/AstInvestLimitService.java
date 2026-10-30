package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitDateRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstInvestLimitMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/Ast41_InvestLimit.java (selectByCompanyId L26 / selectByDate L38 / insert L52 / deleteByDate L88 / update L101 / delete L106) — 투자한도/StopLoss 설정 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstInvestLimitService {

    private final AstInvestLimitMapper mapper;

    /** AS-IS selectByCompanyId */
    public List<InvestLimitDateRes> searchDates(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS selectByDate */
    public List<InvestLimitRes> searchByDate(UserPrincipal user, LocalDate startDate) {
        return mapper.selectByDate(user.getCompanyId(), startDate);
    }

    /**
     * AS-IS insert: 오늘 이전 가장 최근 적용일의 행을 새 적용일로 복사한다.
     * 복사할 행이 없으면 투자자산구분 "2040%"(원본의 "임시" 값) 한 행만 만든다
     */
    @Transactional
    public void create(UserPrincipal user, LocalDate startDate) {
        List<InvestLimitRes> base = mapper.selectByMaxCompanyId(user.getCompanyId());
        if (base.isEmpty()) {
            mapper.insert(mapper.selectNextId(), user.getCompanyId(),
                    new InvestLimitSaveReq(null, startDate, "2040%", null, null, null));
            return;
        }
        for (InvestLimitRes add : base) {
            mapper.insert(mapper.selectNextId(), user.getCompanyId(),
                    new InvestLimitSaveReq(null, startDate, add.investAssetType(), add.limitRate(), add.stopLossRate(), add.note()));
        }
    }

    /** AS-IS deleteByDate → 지운 건수 */
    @Transactional
    public int deleteByDate(UserPrincipal user, LocalDate startDate) {
        return mapper.deleteByDate(user.getCompanyId(), startDate);
    }

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<InvestLimitRes> save(UserPrincipal user, List<InvestLimitSaveReq> rows) {
        for (InvestLimitSaveReq req : rows) {
            if (req.investAssetType() == null || req.investAssetType().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "자산구분은 필수입력 항목입니다.");
            }
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.investLimitId() != null && req.investLimitId() > 0
                    && mapper.selectById(user.getCompanyId(), req.investLimitId()) != null;
            if (exists) {
                mapper.update(user.getCompanyId(), req);
                return mapper.selectById(user.getCompanyId(), req.investLimitId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, user.getCompanyId(), req);
            return mapper.selectById(user.getCompanyId(), newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
