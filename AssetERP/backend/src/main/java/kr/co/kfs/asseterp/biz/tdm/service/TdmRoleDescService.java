package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleDescMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 책무기술서 재생성 (AS-IS Tdm31_Tab_RoleDescAdmin → server/tdm/Tdm31_RoleDesc) */
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
}
