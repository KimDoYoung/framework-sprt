package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AcademicRes;
import kr.co.kfs.asseterp.biz.emp.dto.AcademicSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpAcademicMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp05_Academic.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpAcademicService {

    private final EmpAcademicMapper empAcademicMapper;

    /** AS-IS Emp05_Academic.selectByPersonId */
    public List<AcademicRes> getAcademics(UserPrincipal user, Long personId) {
        return empAcademicMapper.selectAcademics(user.getCompanyId(), personId);
    }

    /** AS-IS Emp05_Academic.update → UpdateDataModel. ID null/≤0: INSERT. ID>0: UPDATE. */
    @Transactional
    public List<AcademicRes> updateAcademics(UserPrincipal user, List<AcademicSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (AcademicSaveReq req : rows) {
            if (req.academicId() == null || req.academicId() <= 0) {
                Long newId = empAcademicMapper.selectNextAcademicId();
                empAcademicMapper.insertAcademic(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empAcademicMapper.updateAcademic(req.academicId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.academicId());
            }
        }
        return resultIds.stream()
                .map(empAcademicMapper::selectAcademicById)
                .toList();
    }

    /** AS-IS Emp05_Academic.delete → UpdateDataModel.deleteModel */
    @Transactional
    public int deleteAcademics(UserPrincipal user, List<Long> academicIds) {
        if (academicIds == null || academicIds.isEmpty()) return 0;
        return empAcademicMapper.deleteAcademics(academicIds, user.getCompanyId());
    }
}
