package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.FamilyRes;
import kr.co.kfs.asseterp.biz.emp.dto.FamilySaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpFamilyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp06_Family.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpFamilyService {

    private final EmpFamilyMapper empFamilyMapper;

    /** AS-IS Emp06_Family.selectByPersonId */
    public List<FamilyRes> getFamilies(UserPrincipal user, Long personId) {
        return empFamilyMapper.selectFamilies(user.getCompanyId(), personId);
    }

    /** AS-IS Emp06_Family.update → UpdateDataModel. ID null/≤0: INSERT. ID>0: UPDATE. */
    @Transactional
    public List<FamilyRes> updateFamilies(UserPrincipal user, List<FamilySaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (FamilySaveReq req : rows) {
            if (req.familyId() == null || req.familyId() <= 0) {
                Long newId = empFamilyMapper.selectNextFamilyId();
                empFamilyMapper.insertFamily(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empFamilyMapper.updateFamily(req.familyId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.familyId());
            }
        }
        return resultIds.stream()
                .map(empFamilyMapper::selectFamilyById)
                .toList();
    }

    /** AS-IS Emp06_Family.delete → UpdateDataModel.deleteModel */
    @Transactional
    public int deleteFamilies(UserPrincipal user, List<Long> familyIds) {
        if (familyIds == null || familyIds.isEmpty()) return 0;
        return empFamilyMapper.deleteFamilies(familyIds, user.getCompanyId());
    }
}
