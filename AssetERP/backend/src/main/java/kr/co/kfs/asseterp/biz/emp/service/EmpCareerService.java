package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.CareerRes;
import kr.co.kfs.asseterp.biz.emp.dto.CareerSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpCareerMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp07_Career.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpCareerService {

    private final EmpCareerMapper empCareerMapper;

    /** AS-IS Emp07_Career.selectByPersonId */
    public List<CareerRes> getCareers(UserPrincipal user, Long personId) {
        return empCareerMapper.selectCareers(user.getCompanyId(), personId);
    }

    /** AS-IS Emp07_Career.update → UpdateDataModel. ID null/≤0: INSERT. ID>0: UPDATE. */
    @Transactional
    public List<CareerRes> updateCareers(UserPrincipal user, List<CareerSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (CareerSaveReq req : rows) {
            if (req.careerId() == null || req.careerId() <= 0) {
                Long newId = empCareerMapper.selectNextCareerId();
                empCareerMapper.insertCareer(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empCareerMapper.updateCareer(req.careerId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.careerId());
            }
        }
        return resultIds.stream()
                .map(empCareerMapper::selectCareerById)
                .toList();
    }

    /** AS-IS Emp07_Career.delete → UpdateDataModel.deleteModel */
    @Transactional
    public int deleteCareers(UserPrincipal user, List<Long> careerIds) {
        if (careerIds == null || careerIds.isEmpty()) return 0;
        return empCareerMapper.deleteCareers(careerIds, user.getCompanyId());
    }
}
