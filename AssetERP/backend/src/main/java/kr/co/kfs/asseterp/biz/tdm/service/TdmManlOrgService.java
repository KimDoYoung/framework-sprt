package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlOrgMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 책무매뉴얼 재생성 (AS-IS Tdm42_Tab_ManlManagerAdmin → server/tdm/Tdm42_ManlOrg) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManlOrgService {

    private final TdmManlOrgMapper mapper;
    private final ManlOrgPdfMaker pdfMaker;

    /**
     * AS-IS tdm.Tdm42_ManlOrg.selectByText (useYn=false, adminYn=true 고정).
     * 회사: KFS 관리자는 고른 회사(없으면 전체), 그 밖에는 로그인 회사. 일자 범위는 전체보기가 아닐 때만 건다.
     */
    public List<ManlOrgRes> search(UserPrincipal user, Long companyId, Long orgId, String searchText, boolean notPeriodYn, String startDate, String closeDate) {
        Long scope = user.isSysAdmin() ? companyId : user.getCompanyId();
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByText(new ManlOrgParam(scope, orgId, like, notPeriodYn, startDate, closeDate));
    }

    /**
     * 한 건 재생성 (AS-IS createRd: 파일 확인·삭제 Tdm42_ManlOrg.fileCheck → CreateTdmManlOrg → RD PDF → fileReName → copyFile).
     * 생성기가 없는 동안에는 {@link ManlOrgPdfMaker}가 먼저 거절해 기존 첨부를 지우지 않는다.
     */
    @Transactional
    public void recreate(UserPrincipal user, Long manlOrgId) {
        Long companyId = requireScope(user, manlOrgId);
        pdfMaker.make(manlOrgId, companyId);
    }

    /** 대상 행의 회사를 읽어 KFS 관리자 외에는 로그인 회사 행만 허용한다 */
    Long requireScope(UserPrincipal user, Long manlOrgId) {
        Long companyId = mapper.selectCompanyId(manlOrgId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.isSysAdmin() && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }
}
