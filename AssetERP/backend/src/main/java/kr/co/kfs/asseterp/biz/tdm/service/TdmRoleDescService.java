package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcPersonRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescCompanyParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescCompanyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleDescMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 책무기술서 재생성(AS-IS Tdm31_Tab_RoleDescAdmin)·작성(Tdm31_Tab_RoleDesc) → server/tdm/Tdm31_RoleDesc */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmRoleDescService {

    private final TdmRoleDescMapper mapper;
    private final RoleDescPdfMaker pdfMaker;

    /**
     * AS-IS tdm.Tdm31_RoleDesc.selectByRegDateAdmin.
     * 회사: KFS 관리자는 고른 회사(없으면 전체), 그 밖에는 로그인 회사. 일자 범위는 전체보기가 아닐 때만 건다.
     */
    public List<RoleDescRes> search(UserPrincipal user, Long companyId, String startDate, String closeDate, String searchText,
                                    boolean endYn, boolean notPeriodYn) {
        Long scope = user.isSysAdmin() ? companyId : user.getCompanyId();
        return mapper.selectByRegDateAdmin(new RoleDescParam(scope, startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%", endYn, notPeriodYn));
    }

    /**
     * 한 건 재생성 (AS-IS createRd: 파일 확인·삭제 Tdm31_RoleDesc.fileCheck → CreateTdmRoleDesc → RD PDF → fileReName → copyFile).
     * 생성기가 없는 동안에는 {@link RoleDescPdfMaker}가 먼저 거절해 기존 첨부를 지우지 않는다.
     */
    @Transactional
    public void recreate(UserPrincipal user, Long roleDescId) {
        Long companyId = mapper.selectCompanyId(roleDescId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.isSysAdmin() && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        pdfMaker.make(roleDescId, companyId);
    }

    /** AS-IS tdm.Tdm31_RoleDesc.selectByRegDate (N12) — 로그인 회사만. 검색어는 '%…%'로 감싼다 */
    public List<RoleDescCompanyRes> searchCompany(UserPrincipal user, String startDate, String closeDate, String searchText,
                                                  boolean notEndYn, boolean notPeriodYn) {
        return mapper.selectByRegDate(new RoleDescCompanyParam(user.getCompanyId(), startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%", notEndYn, notPeriodYn));
    }

    /** AS-IS tdm.Tdm30_RoleAllc.selectPerson (Tdm30_Lookup_SelectMulti) */
    public List<RoleAllcPersonRes> searchPersons(UserPrincipal user, LocalDate stdDate, String searchText) {
        return mapper.selectPerson(user.getCompanyId(), stdDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS Tdm31_RoleDesc.update(UpdateDataModel): roleDescId가 없거나 ≤ 0이면 INSERT, 아니면 생성일·생성사유 UPDATE */
    @Transactional
    public void save(UserPrincipal user, List<RoleDescSaveReq> rows) {
        for (RoleDescSaveReq row : rows) {
            if (row.roleDescId() == null || row.roleDescId() <= 0) {
                mapper.insertRoleDesc(mapper.selectNextId(), user.getCompanyId(), row.regDate(), row.reasonCode(), row.personId(),
                        row.roleAllcId(), row.allcStdDate(), user.getName());
            } else {
                checkCompany(user, row.roleDescId());
                mapper.updateRoleDesc(row.roleDescId(), user.getCompanyId(), row.regDate(), row.reasonCode(), user.getName());
            }
        }
    }

    /** AS-IS Tdm31_RoleDesc.delete (UpdateDataModel.deleteModel) + 첨부 행 정리(승인된 제안) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> roleDescIds) {
        if (roleDescIds == null || roleDescIds.isEmpty()) {
            return 0;
        }
        for (Long id : roleDescIds) {
            checkCompany(user, id);
        }
        mapper.deleteFilesByParentIds(roleDescIds);
        return mapper.deleteRoleDescs(user.getCompanyId(), roleDescIds);
    }

    /** AS-IS Tdm31_RoleDesc.aprWorkCheck: 1분 안에 파일을 만들고 있으면 true(AS-IS status 1 = 작업중) */
    public boolean isWorking(UserPrincipal user, Long roleDescId) {
        checkCompany(user, roleDescId);
        return mapper.countWorking(roleDescId) > 0;
    }

    /** 책무기술서가 로그인 회사 것이어야 한다 */
    private void checkCompany(UserPrincipal user, Long roleDescId) {
        Long companyId = mapper.selectCompanyId(roleDescId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
