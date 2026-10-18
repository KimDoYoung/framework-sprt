package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActAccountCodeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/act/Act01_AccountCode.java (selectBySlipYn L40) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActAccountCodeService {

    private final ActAccountCodeMapper mapper;

    /**
     * AS-IS Act01_Lookup_AccountCode.retrieve() L181-216: 회사 없으면 로그인 회사, 속성 없으면 "%", 검색어 "%검색어%"(없으면 "%").
     * 다른 회사는 관리자 회사만(클라이언트 값을 그냥 믿지 않는다)
     */
    public List<AccountCodeRes> searchBySlipYn(UserPrincipal user, Long companyId, String attributeCode, String searchText) {
        Long target = companyId == null ? user.getCompanyId() : companyId;
        if (!target.equals(user.getCompanyId()) && !user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        String attribute = attributeCode == null || attributeCode.isEmpty() ? "%" : attributeCode;
        String search = searchText == null ? "%" : "%" + searchText + "%";
        return mapper.selectBySlipYn(target, search, attribute);
    }
}
