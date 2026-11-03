package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprMgrRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprMgrSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprAltApprMgrMapper;
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

/** 대결자 지정(관리자) (AS-IS Apr07_Tab_AltApprMgr → server/apr/Apr07_AltAppr) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprAltApprMgrService {

    private final AprAltApprMgrMapper mapper;

    /** AS-IS selectByText L24: searchText = '%글자%'(원결재자 이름), 기간은 시작일·종료일이 조회기간에 걸린 행 */
    public List<AprAltApprMgrRes> search(UserPrincipal user, LocalDate startDate, LocalDate endDate, String searchText) {
        return mapper.selectByText(user.getCompanyId(), startDate, endDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS update() L248-332: 수정한 행 필수 검사 → notAltApprIdList(그리드에 없는 DB 행)와 합쳐 같은 원결재자의 기간이 겹치면 중복 → UpdateDataModel.
     * 저장된 행을 요청과 같은 순서로 돌려준다
     */
    @Transactional
    public List<AprAltApprMgrRes> save(UserPrincipal user, List<AprAltApprMgrSaveReq> rows) {
        Long companyId = user.getCompanyId();
        validate(companyId, rows);
        return rows.stream().map(r -> {
            long id = (r.altApprId() == null || r.altApprId() <= 0) ? mapper.selectNextId() : r.altApprId();
            AprAltApprMgrSaveReq row = new AprAltApprMgrSaveReq(id, r.targetEmpId(), r.targetEmpName(), r.altEmpId(), r.altEmpName(),
                    r.startDate(), r.closeDate(), r.stampYn(), r.reasonCd(), r.emgrPoint(), r.note());
            if (mapper.update(companyId, row) == 0 && mapper.insert(companyId, row) == 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "원결재자·대결자는 이 회사의 사원이어야 합니다");
            }
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }

    private void validate(Long companyId, List<AprAltApprMgrSaveReq> rows) {
        for (AprAltApprMgrSaveReq r : rows) {
            if (r.targetEmpId() == null) throw invalid("원결재자를 지정해야 합니다");
            if (r.altEmpId() == null) throw invalid("대결자를 지정해야 합니다");
            if (r.startDate() == null) throw invalid("시작일을 지정해야 합니다");
            if (r.closeDate() == null) throw invalid("종료일을 지정해야 합니다");
            if (r.reasonCd() == null) throw invalid("대결사유를 입력해야 합니다");
        }
        List<Long> ids = rows.stream().map(AprAltApprMgrSaveReq::altApprId).filter(Objects::nonNull).toList();
        List<Period> all = new ArrayList<>();
        // AS-IS의 새 행은 GridInsertRow가 getSeq로 ID를 미리 받아 altApprId가 null이 아니다 → 새 행에도 서로 다른 임시 ID(음수)를 주어 같은 규칙으로 검사한다
        for (int i = 0; i < rows.size(); i++) {
            AprAltApprMgrSaveReq r = rows.get(i);
            all.add(new Period(r.altApprId() != null && r.altApprId() > 0 ? r.altApprId() : -(i + 1L), r.targetEmpId(), r.startDate(), r.closeDate()));
        }
        mapper.selectNotInIds(companyId, ids).forEach(r -> all.add(new Period(r.altApprId(), r.targetEmpId(), r.startDate(), r.closeDate())));
        for (int i = 0; i < all.size(); i++) {
            Period m1 = all.get(i);
            for (int j = i + 1; j < all.size(); j++) {
                Period m2 = all.get(j);
                if (!m1.id().equals(m2.id()) && m1.target().equals(m2.target())
                        && !m1.start().isAfter(m2.close()) && !m1.close().isBefore(m2.start())) {
                    throw invalid("대결자 설정기간이 중복되는 값이 존재합니다");
                }
            }
        }
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }

    private record Period(Long id, Long target, LocalDate start, LocalDate close) {
    }
}
