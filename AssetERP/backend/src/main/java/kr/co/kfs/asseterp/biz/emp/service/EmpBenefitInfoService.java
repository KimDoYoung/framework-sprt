package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoCopyReq;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpBenefitInfoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/emp/Emp55_BenefitInfo.java (selectBySearchText L25 / insertInitData L83 / update L98 / delete L103)
 * — 왼쪽은 로그인 회사, 오른쪽은 고른 고객사(companyId)의 복리후생비 설정. 다른 회사를 다루는 것은 관리자 회사만
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpBenefitInfoService {

    private final EmpBenefitInfoMapper mapper;

    /** AS-IS selectBySearchText: 복리후생비 코드 LIKE "%검색어%" */
    public List<BenefitInfoRes> search(UserPrincipal user, Long companyId, String searchText) {
        return mapper.selectBySearchText(targetCompany(user, companyId), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectByCompanyId: 로그인 회사의 복리후생비 설정 전체(복리후생비 코드순) — U05 계정코드 창 */
    public List<BenefitInfoRes> searchByCompany(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS selectByBenefitCode: 신청구분 한 건의 설정(없으면 null) — U05 문서분류 연결코드·계정과목 */
    public BenefitInfoRes getByBenefitCode(UserPrincipal user, String benefitCode) {
        List<BenefitInfoRes> list = mapper.selectByBenefitCode(user.getCompanyId(), benefitCode);
        return list.isEmpty() ? null : list.get(0);
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하·없음)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<BenefitInfoRes> update(UserPrincipal user, Long companyId, List<BenefitInfoSaveReq> rows) {
        Long target = targetCompany(user, companyId);
        List<BenefitInfoRes> saved = new ArrayList<>();
        for (BenefitInfoSaveReq req : rows) {
            boolean isNew = req.benefitInfoId() == null || req.benefitInfoId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.benefitInfoId();
            if (isNew) {
                mapper.insert(id, target, req);
            } else if (mapper.update(target, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다(05 §6) */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, List<Long> ids) {
        Long target = targetCompany(user, companyId);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(target, ids);
    }

    /** AS-IS insertInitData: 고른 설정을 고른 고객사 각각으로 복사(기존 행은 지우지 않는다 — 원본 동작) → 복사한 건수. 관리자 회사만 */
    @Transactional
    public int insertInitData(UserPrincipal user, BenefitInfoCopyReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<Long> companyIds = req.companyIds() == null ? List.of() : req.companyIds();
        List<Long> ids = req.benefitInfoIds() == null ? List.of() : req.benefitInfoIds();
        int count = 0;
        for (Long companyId : companyIds) {
            for (Long id : ids) {
                count += mapper.insertInitData(companyId, id);
            }
        }
        return count;
    }

    /** 대상 회사: 없거나 로그인 회사면 로그인 회사, 다른 회사는 관리자 회사만(클라이언트 값을 그냥 믿지 않는다) */
    private Long targetCompany(UserPrincipal user, Long companyId) {
        if (companyId == null || companyId.equals(user.getCompanyId())) {
            return user.getCompanyId();
        }
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }
}
