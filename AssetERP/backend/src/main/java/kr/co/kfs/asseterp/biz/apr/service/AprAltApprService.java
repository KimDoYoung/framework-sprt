package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprAltApprMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * AS-IS Apr07_Tab_AltAppr → server/apr/Apr07_AltAppr.java (selectByEmpId L42 / notAltApprIdList L56 / update L148 / delete L153).
 * 원결재자는 로그인 사원이고, 수정·삭제도 로그인 사원의 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprAltApprService {

    private final AprAltApprMapper mapper;

    /** AS-IS selectByEmpId(empId = LoginUser.getUserId()) */
    public List<AprAltApprRes> search(UserPrincipal user) {
        return mapper.selectByEmpId(user.getUserId());
    }

    /**
     * AS-IS update() L196-275의 notAltApprIdList + 중복기간 검사 → UpdateDataModel.
     * 요청 행 + 요청에 없는 DB 행을 합쳐 서로 기간이 겹치면 "'이름'님과 대결자 설정기간이 중복됩니다". 저장된 행을 요청과 같은 순서로 돌려준다
     */
    @Transactional
    public List<AprAltApprRes> save(UserPrincipal user, List<AprAltApprSaveReq> rows) {
        Long empId = user.getUserId();
        validate(user, rows);
        return rows.stream().map(r -> {
            long id = (r.altApprId() == null || r.altApprId() <= 0) ? mapper.selectNextId() : r.altApprId();
            AprAltApprSaveReq row = new AprAltApprSaveReq(id, r.altEmpId(), r.altEmpName(), r.startDate(), r.closeDate(), r.stampYn(), r.reasonCd(), r.emgrPoint());
            if (mapper.update(empId, row) == 0) {
                mapper.insert(empId, row);
            }
            return mapper.selectById(id, empId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteById(user.getUserId(), id)).sum();
    }

    private void validate(UserPrincipal user, List<AprAltApprSaveReq> rows) {
        for (AprAltApprSaveReq r : rows) {
            if (r.altEmpId() == null) throw invalid("대결자는 필수입력 항목입니다");
            if (r.startDate() == null) throw invalid("시작일은 필수입력 항목입니다");
            if (r.closeDate() == null) throw invalid("종료일은 필수입력 항목입니다");
            if (r.reasonCd() == null || r.reasonCd().isEmpty()) throw invalid("대결사유는 필수입력 항목입니다");
        }
        List<Long> ids = rows.stream().map(AprAltApprSaveReq::altApprId).filter(Objects::nonNull).toList();
        List<Period> all = new ArrayList<>();
        rows.forEach(r -> all.add(new Period(r.altApprId(), r.altEmpName(), r.startDate(), r.closeDate())));
        mapper.selectNotInIds(user.getCompanyId(), user.getUserId(), ids)
                .forEach(r -> all.add(new Period(r.altApprId(), r.altEmpName(), r.startDate(), r.closeDate())));
        for (int i = 0; i < all.size(); i++) {
            Period m1 = all.get(i);
            for (int j = i + 1; j < all.size(); j++) {
                Period m2 = all.get(j);
                if (m1.id() != null && !m1.id().equals(m2.id())
                        && !m1.start().isAfter(m2.close()) && !m1.close().isBefore(m2.start())) {
                    throw invalid("'" + m1.name() + "'님과 대결자 설정기간이 중복됩니다");
                }
            }
        }
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }

    private record Period(Long id, String name, LocalDate start, LocalDate close) {
    }
}
