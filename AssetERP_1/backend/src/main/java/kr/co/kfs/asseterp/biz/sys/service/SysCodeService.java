package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCodeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys09_Code.selectByCodeKind — 공통코드 콤보(ComboBoxField)가 부른다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCodeService {

    private final SysCodeMapper sysCodeMapper;

    /** 로그인 회사의 코드(시스템 코드는 admin 회사 0의 것), 오늘 기준 */
    public List<CodeRes> searchCodes(UserPrincipal user, String kindCd) {
        return sysCodeMapper.searchCodesByKind(new CodeSearchParam(user.getCompanyId(), kindCd));
    }
}
