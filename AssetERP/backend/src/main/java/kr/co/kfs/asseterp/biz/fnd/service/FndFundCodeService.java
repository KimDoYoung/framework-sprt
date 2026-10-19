package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndFundCodeMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/fnd/Fnd01_FundCode.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndFundCodeService {

    private final FndFundCodeMapper mapper;
    private final EmpTransInfoService transInfoService;

    /**
     * AS-IS fnd.Fnd01_FundCode.selectByFundOrgAuth L56 (F06 펀드별 문서검색). 펀드명은 서버가 %…%로, planYn은 null(임시펀드 + 일반펀드).
     * admin = 회사관리자·관리자 회사면 조직 조건 없이, 아니면 내 조직(LoginUser.getOrgCodeId — 회사관리자는 0)이 권한을 가진 펀드만
     */
    public List<FundCodeRes> searchByOrgAuth(UserPrincipal user, boolean closeYn, boolean classFundExceptYn, String fundName,
                                             String fundTypeCode, String classTypeCode) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        String admin = String.valueOf(SysMenuSearchService.isManager(user));
        return mapper.selectByFundOrgAuth(new FundCodeCond(user.getCompanyId(), orgId, user.getUserId(), admin, String.valueOf(closeYn),
                String.valueOf(classFundExceptYn), "%" + (fundName == null ? "" : fundName) + "%", blankToAny(fundTypeCode), blankToAny(classTypeCode)));
    }

    private String blankToAny(String code) {
        return code == null || code.isBlank() ? "%" : code;
    }
}
