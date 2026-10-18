package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleDigmMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 책무체계도 재생성 (AS-IS Tdm32_Tab_RoleDigmAdmin → server/tdm/Tdm32_RoleDigm·Tdm33_RoleDigmFile) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmRoleDigmService {

    private final TdmRoleDigmMapper mapper;
    private final RoleDigmPdfMaker pdfMaker;

    /**
     * AS-IS tdm.Tdm32_RoleDigm.selectByRegDateAdmin.
     * 회사: KFS 관리자는 고른 회사(없으면 전체), 그 밖에는 로그인 회사. 일자 범위는 전체보기가 아닐 때만 건다.
     */
    public List<RoleDigmRes> search(UserPrincipal user, Long companyId, String startDate, String closeDate, boolean endYn, boolean notPeriodYn) {
        Long scope = user.isSysAdmin() ? companyId : user.getCompanyId();
        return mapper.selectByRegDateAdmin(new RoleDigmParam(scope, startDate, closeDate, endYn, notPeriodYn));
    }

    /** AS-IS tdm.Tdm33_RoleDigmFile.selectByFileType 의 파일정보 ID들 (화면이 건수와 첫 건을 쓴다). 회사 범위는 행의 회사로 검사 */
    public List<Long> fileIds(UserPrincipal user, Long roleDigmId, String fileType) {
        requireScope(user, roleDigmId);
        return mapper.selectFileIdByFileType(roleDigmId, fileType);
    }

    /**
     * 한 건 재생성 (AS-IS createRd: 파일 확인·삭제 Tdm32_RoleDigm.fileCheck → CreateTdmRoleDigm → RD PDF → fileReName → copyFile).
     * 생성기가 없는 동안에는 {@link RoleDigmPdfMaker}가 먼저 거절해 기존 첨부를 지우지 않는다.
     */
    @Transactional
    public void recreate(UserPrincipal user, Long roleDigmId) {
        Long companyId = requireScope(user, roleDigmId);
        pdfMaker.make(roleDigmId, companyId);
    }

    private Long requireScope(UserPrincipal user, Long roleDigmId) {
        Long companyId = mapper.selectCompanyId(roleDigmId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.isSysAdmin() && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }
}
