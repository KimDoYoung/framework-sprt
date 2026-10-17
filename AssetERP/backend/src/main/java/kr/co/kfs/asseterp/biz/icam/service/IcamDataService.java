package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamDataRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamDataMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/icam/Icam02_Data.java (selectByCompanyId L18) — 로그인 회사의 ICAM 연계 데이터 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamDataService {

    private final IcamDataMapper mapper;

    public List<IcamDataRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }
}
