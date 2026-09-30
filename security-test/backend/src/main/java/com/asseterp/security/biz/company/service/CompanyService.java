package com.asseterp.security.biz.company.service;

import com.asseterp.security.biz.company.dto.CompanyItemRes;
import com.asseterp.security.biz.company.dto.CompanyRes;
import com.asseterp.security.biz.company.dto.TenantRes;
import com.asseterp.security.biz.company.mapper.CompanyMapper;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import com.asseterp.security.common.tenant.Tenant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyMapper companyMapper;

    public TenantRes getTenant(Tenant tenant) {
        CompanyRes company = tenant.company();
        return new TenantRes(
                tenant.host(),
                tenant.code(),
                company != null ? company.companyId() : null,
                company != null ? company.companyName() : null,
                tenant.isValid(),
                tenant.admin());
    }

    /**
     * admin 테넌트 로그인 화면의 회사 선택 목록 (AS-IS Sys01_Lookup_SelectSingle). 다른 테넌트에서는 회사 목록을 노출하지 않는다.
     */
    public List<CompanyItemRes> searchCompanies(Tenant tenant) {
        if (!tenant.admin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyMapper.findAllUsable().stream()
                .map(c -> new CompanyItemRes(c.companyId(), c.companyCode(), c.companyName()))
                .toList();
    }
}
