package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupMemberRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupMemberSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprStepGroupMemberMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/** 결재선 지정그룹 멤버 (AS-IS Apr31_Page_ApprStepGroupMember → server/apr/Apr31_ApprStepGroupMember) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprStepGroupMemberService {

    private final AprApprStepGroupMemberMapper mapper;

    /** AS-IS selectByApprStepGroupId (companyId는 서버가 세션에서) */
    public List<AprApprStepGroupMemberRes> search(UserPrincipal user, Long apprStepGroupId) {
        return mapper.selectByApprStepGroupId(user.getCompanyId(), apprStepGroupId);
    }

    /**
     * AS-IS update() L316-374: 구분 필수 → 사원 중복 검사 → 요청 순서대로 seq "001"~ 를 매겨 UpdateDataModel(있으면 UPDATE, 없으면 INSERT).
     * 저장 뒤 화면이 다시 조회한다
     */
    @Transactional
    public void save(UserPrincipal user, Long apprStepGroupId, List<AprApprStepGroupMemberSaveReq> rows) {
        if (mapper.countGroup(user.getCompanyId(), apprStepGroupId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        for (AprApprStepGroupMemberSaveReq r : rows) {
            if (r.stepTypeCode() == null || r.stepTypeCode().isEmpty()) throw invalid("구분값은 필수 입력항목입니다");
        }
        if (rows.stream().map(AprApprStepGroupMemberSaveReq::stepEmpId).filter(Objects::nonNull).distinct().count() != rows.size()) {
            throw invalid("결재선에 중복된 사원이 존재합니다");
        }
        for (int i = 0; i < rows.size(); i++) {
            AprApprStepGroupMemberSaveReq r = rows.get(i);
            String seq = String.format("%03d", i + 1);
            Long id = r.apprStepGroupMemberId();
            if (id == null || id <= 0 || mapper.update(apprStepGroupId, id, r.stepTypeCode(), seq, r.note(), r.stepEmpId()) == 0) {
                mapper.insert(apprStepGroupId, mapper.selectNextId(), r.stepTypeCode(), seq, r.note(), r.stepEmpId());
            }
        }
    }

    /** AS-IS Apr31_ApprStepGroupMember.delete → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
