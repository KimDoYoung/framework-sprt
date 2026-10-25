package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCompanySetupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 책무관리 시스템설정 (AS-IS server/tdm/Tdm91_CompanySetup) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmCompanySetupService {

    /** AS-IS update L73-: 이 날짜(기본 행의 적용시작일)는 저장할 수 없다 */
    private static final LocalDate INIT_DATE = LocalDate.of(2026, 1, 1);

    /** 조회가 주는 기본 행(DB에 없음)의 ID — 저장하면 INSERT. 매퍼 selectByCompanyId의 값과 같다 */
    public static final long DEFAULT_ROW_ID = -999999999L;

    private final TdmCompanySetupMapper mapper;

    /** AS-IS Tdm91_CompanySetup.selectByCompanyId (회사 = 로그인 회사) */
    public List<CompanySetupRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /**
     * AS-IS Tdm91_CompanySetup.update: 기본 날짜·중복 검사 뒤 UpdateDataModel — 키가 DB에 없으면 INSERT(IsNewData), 있으면 UPDATE.
     * 중복 검사는 원본 그대로 ID 없는 새 행에서는 걸리지 않고, 기본 행·기존 행에서는 건다. 저장한 행을 요청 순서로 돌려준다
     */
    @Transactional
    public List<CompanySetupRes> save(UserPrincipal user, List<CompanySetupSaveReq> rows) {
        for (CompanySetupSaveReq row : rows) {
            if (row.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "적용시작일자를 입력하세요");
            }
            if (row.startDate().equals(INIT_DATE)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "적용 시작일은 '2026-01-02'부터 선택 가능합니다");
            }
            // AS-IS 새 행은 ID가 null이라 != 비교가 거짓 → 중복 검사가 안 걸린다(원본 동작). 기본 행은 ID가 있다
            boolean noId = row.companySetupId() == null || (row.companySetupId() <= 0 && row.companySetupId() != DEFAULT_ROW_ID);
            if (mapper.countByDate(user.getCompanyId(), row.startDate(), noId ? null : row.companySetupId()) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "적용 시작일자가 중복되었습니다");
            }
        }
        List<Long> ids = new ArrayList<>();
        for (CompanySetupSaveReq row : rows) {
            Long id = row.companySetupId();
            Long ownerCompanyId = id == null || id <= 0 ? null : mapper.selectCompanyId(id);
            if (ownerCompanyId == null) {
                // IsNewData: 키가 DB에 없으면 INSERT (ID 없는 새 행·기본 행은 새 ID, 그 밖에 사라진 행은 같은 ID로 다시 넣는다)
                Long newId = id != null && id > 0 ? id : mapper.selectNextId();
                mapper.insertCompanySetup(newId, user.getCompanyId(), row, user.getName());
                ids.add(newId);
            } else {
                checkCompany(user, id);
                mapper.updateCompanySetup(row, user.getName());
                ids.add(id);
            }
        }
        return ids.stream().map(mapper::selectById).toList();
    }

    /** AS-IS Tdm91_CompanySetup.delete (UpdateDataModel.deleteModel) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> companySetupIds) {
        if (companySetupIds == null || companySetupIds.isEmpty()) {
            return 0;
        }
        for (Long id : companySetupIds) {
            checkCompany(user, id);
        }
        return mapper.deleteCompanySetups(user.getCompanyId(), companySetupIds);
    }

    /** 설정 행이 로그인 회사 것이어야 한다 */
    private void checkCompany(UserPrincipal user, Long companySetupId) {
        Long companyId = mapper.selectCompanyId(companySetupId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
