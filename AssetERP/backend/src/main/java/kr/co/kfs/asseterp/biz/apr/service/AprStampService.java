package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampManageRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprStampMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/apr/Apr10_Stamp.java selectBySearchText2 L36 (Apr10_Lookup_DocStamp, flag=true), selectBySearchText (Apr10_Lookup_Stamp, flag=true) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprStampService {

    private final AprStampMapper mapper;

    /**
     * 검색어 "%…%" → 문서분류에서 제외하지 않은 인감 중, 모두 사용 가능하거나 사용자 조직에 역할로 준 것.
     * 사용자 조직(AS-IS LoginUser.getOrgCodeId)은 회사관리자(userId &lt; 0)면 0, 직원이면 가장 최근 발령(겸직 제외)의 조직
     */
    public List<AprStampRes> searchDocStamp(UserPrincipal user, Long classTreeId, String searchText) {
        return mapper.selectBySearchText2(user.getCompanyId(), classTreeId, orgCodeId(user), like(searchText));
    }

    /** AS-IS Apr10_Stamp.selectBySearchText (G06 Apr10_Lookup_Stamp, flag=true): 모두 사용 가능하거나 사용자 조직에 역할로 준 인감, 사용기간 안의 것 */
    public List<AprStampRes> searchStamp(UserPrincipal user, String searchText) {
        return mapper.selectBySearchText(user.getCompanyId(), orgCodeId(user), like(searchText));
    }

    /** AS-IS Apr10_Stamp.selectByCodeName (G07 Apr10_Tab_Stamp): 로그인 회사의 모든 인감 */
    public List<AprStampManageRes> searchManage(UserPrincipal user) {
        return mapper.selectByCodeName(user.getCompanyId());
    }

    /**
     * AS-IS Apr10_Tab_Stamp.update() 검사 → Apr10_Stamp.update(UpdateDataModel). 새 행(stampId 없음·0 이하)은 새 ID로 INSERT.
     * 부서·(정)책임자·(부)책임자·인감이름·시작날짜가 비면 AS-IS와 같은 메시지로 거절한다. 저장한 행을 요청과 같은 순서로 돌려준다
     */
    @Transactional
    public List<AprStampManageRes> saveManage(UserPrincipal user, List<AprStampSaveReq> rows) {
        for (AprStampSaveReq r : rows) {
            if (r.orgId() == null) throw invalid("부서는 필수선택 항목입니다");
            if (r.aprEmpId() == null) throw invalid("(정)책임자는 필수선택 항목입니다");
            if (r.secondEmpId() == null) throw invalid("(부)책임자는 필수선택 항목입니다");
            if (r.stampName() == null || r.stampName().isEmpty()) throw invalid("인감이름은 필수입력 항목입니다");
            if (r.startDate() == null) throw invalid("시작날짜는 필수선택 항목입니다");
        }
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            boolean isNew = r.stampId() == null || r.stampId() <= 0;
            long id = isNew ? mapper.selectNextId() : r.stampId();
            AprStampSaveReq row = new AprStampSaveReq(id, r.orgId(), r.aprEmpId(), r.secondEmpId(), r.stampName(), r.startDate(), r.closeDate(),
                    r.useName(), r.corpStampYn(), r.stepUseYn(), r.allUseYn(), r.note());
            if (isNew) {
                mapper.insertStamp(companyId, row);
            } else if (mapper.updateStamp(companyId, row) == 0) {
                throw invalid("인감을 찾을 수 없습니다");
            }
            return mapper.selectManageById(companyId, id);
        }).toList();
    }

    /** AS-IS LoginUser.getOrgCodeId() — [등록]이 새 행의 부서 기본값으로 쓴다 (G07). 회사관리자는 0 */
    public Long getMyOrgCodeId(UserPrincipal user) {
        return orgCodeId(user);
    }

    /** AS-IS Apr10_Stamp.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int deleteManage(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteStamp(user.getCompanyId(), id)).sum();
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }

    private Long orgCodeId(UserPrincipal user) {
        Long orgId = 0L;
        if (user.getUserId() != null && user.getUserId() > 0) {
            Long org = mapper.selectOrgCodeId(user.getUserId());
            orgId = org == null ? 0L : org;
        }
        return orgId;
    }

    private String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }
}
