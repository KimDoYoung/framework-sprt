package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.CertRes;
import kr.co.kfs.asseterp.biz.emp.dto.CertRow;
import kr.co.kfs.asseterp.biz.emp.dto.CertSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpCertMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/Emp15_Cert.java (selectByCompanyId / modelUpdate / delete) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpCertService {

    private final EmpCertMapper mapper;

    /** AS-IS selectByCompanyId(companyId, startDate, closeDate) */
    public List<CertRes> searchCerts(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectCerts(user.getCompanyId(), startDate, closeDate);
    }

    /**
     * AS-IS modelUpdate: certId가 없으면 채번해 INSERT → 새 증명서 ID.
     * AS-IS는 사원이 로그인 회사 소속인지 보지 않지만 TOBE는 소속을 확인한다.
     */
    @Transactional
    public Long createCert(UserPrincipal user, CertSaveReq req) {
        if (mapper.countPerson(user.getCompanyId(), req.personId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        Long certId = mapper.selectNextId();
        mapper.insertCert(new CertRow(certId, user.getCompanyId(), req.issueDate(), req.linkCode(), req.personId(),
                req.certUseCode(), req.certUse(), req.dcrClassTreeId()));
        return certId;
    }

    /** AS-IS delete — 화면이 결재상태가 있는 행은 막는다. TOBE는 로그인 회사 행만 지운다 */
    @Transactional
    public int deleteCert(UserPrincipal user, Long certId) {
        return mapper.deleteCert(user.getCompanyId(), certId);
    }
}
