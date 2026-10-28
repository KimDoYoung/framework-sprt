package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxWithholdingRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxWithholdingSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxWithholdingMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/** AS-IS server/pay/Pay40_IncomeTaxWithholding.java (selectByCompanyId L26 / updateList L46 / delete L71) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayTaxWithholdingService {

    /** 상신 상태 10:진행 20:진행 30:완료 — 이 문서가 걸린 행은 저장·삭제 못 한다 */
    private static final Set<String> IN_APPR = Set.of("10", "20", "30");

    private final PayTaxWithholdingMapper mapper;

    /** AS-IS retrieve() L320: 기준연도를 LIKE로 비교한다(빈 글자면 아무 행도 안 나온다 — 원본 그대로) */
    public List<PayTaxWithholdingRes> search(UserPrincipal user, String stdYear) {
        return mapper.selectByCompanyId(user.getCompanyId(), stdYear == null ? "" : stdYear);
    }

    /**
     * AS-IS update() L348 + updateList L46: 있는 행은 고치고 없는 행은 새 ID로 넣는다 → 저장된 행(요청 순서).
     * 필수값·상신 중 검사는 화면 검사를 서버에서도, 사원이 로그인 회사 소속인지 확인한다(TOBE 추가)
     */
    @Transactional
    public List<PayTaxWithholdingRes> save(UserPrincipal user, List<PayTaxWithholdingSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (PayTaxWithholdingSaveReq req : rows) {
            if (req.regDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "발급신청일은 필수선택 항목입니다");
            }
            if (req.personId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사원명은 필수선택 항목입니다");
            }
            if (req.purUseCode() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "용도는 필수선택 항목입니다");
            }
            if (req.submitTo() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "제출처는 필수입력 항목입니다");
            }
            if (req.cnt() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "소요수량(통)은 필수입력 항목입니다");
            }
            PayTaxWithholdingRes old = existing(companyId, req.incomeTaxWithholdingId());
            if (old != null && inAppr(old)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 결재가 진행 중이거나 완료된 문서는 수정이 불가능합니다");
            }
            if (old == null && (req.stdYear() == null || !req.stdYear().matches("\\d{4}"))) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준연도를 확인해주세요");
            }
            if (mapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.stream().map(req -> {
            if (existing(companyId, req.incomeTaxWithholdingId()) != null) {
                mapper.update(companyId, req);
                return mapper.selectById(companyId, req.incomeTaxWithholdingId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, companyId, req);
            return mapper.selectById(companyId, newId);
        }).toList();
    }

    /** AS-IS delete() L403: 결재 중·완료 행이 하나라도 있으면 막는다 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        Long companyId = user.getCompanyId();
        for (Long id : ids) {
            PayTaxWithholdingRes old = existing(companyId, id);
            if (old != null && inAppr(old)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "결재 중이거나 완료된 문서가 포함된 정보는 삭제할 수 없습니다");
            }
        }
        return mapper.deleteByIds(companyId, ids);
    }

    private PayTaxWithholdingRes existing(Long companyId, Long id) {
        return id != null && id > 0 ? mapper.selectById(companyId, id) : null;
    }

    private static boolean inAppr(PayTaxWithholdingRes row) {
        return row.apprId() != null && row.statusCode() != null && IN_APPR.contains(row.statusCode());
    }
}
