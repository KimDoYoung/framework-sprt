package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.LicenseRes;
import kr.co.kfs.asseterp.biz.emp.dto.LicenseSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpLicenseMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp08_License.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpLicenseService {

    private final EmpLicenseMapper empLicenseMapper;

    /** AS-IS Emp08_License.selectByPersonId */
    public List<LicenseRes> getLicenses(UserPrincipal user, Long personId) {
        return empLicenseMapper.selectLicenses(user.getCompanyId(), personId);
    }

    /** AS-IS Emp08_License.update → UpdateDataModel. ID null/≤0: INSERT. ID>0: UPDATE. */
    @Transactional
    public List<LicenseRes> updateLicenses(UserPrincipal user, List<LicenseSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (LicenseSaveReq req : rows) {
            if (req.licenseId() == null || req.licenseId() <= 0) {
                Long newId = empLicenseMapper.selectNextLicenseId();
                empLicenseMapper.insertLicense(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empLicenseMapper.updateLicense(req.licenseId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.licenseId());
            }
        }
        return resultIds.stream()
                .map(empLicenseMapper::selectLicenseById)
                .toList();
    }

    /** AS-IS Emp08_License.delete → UpdateDataModel.deleteModel */
    @Transactional
    public int deleteLicenses(UserPrincipal user, List<Long> licenseIds) {
        if (licenseIds == null || licenseIds.isEmpty()) return 0;
        return empLicenseMapper.deleteLicenses(licenseIds, user.getCompanyId());
    }
}
