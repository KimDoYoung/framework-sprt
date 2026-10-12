package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EducationCopyReq;
import kr.co.kfs.asseterp.biz.emp.dto.EducationRes;
import kr.co.kfs.asseterp.biz.emp.dto.EducationSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEducationMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp19_Education.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEducationService {

    private final EmpEducationMapper empEducationMapper;

    /** selectByPersonId L23 */
    public List<EducationRes> getEducations(UserPrincipal user, Long personId) {
        return empEducationMapper.selectEducations(user.getCompanyId(), personId);
    }

    /** update L53 (UpdateDataModel INSERT/UPDATE) */
    @Transactional
    public List<EducationRes> updateEducations(UserPrincipal user, List<EducationSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (EducationSaveReq req : rows) {
            if (req.educationId() == null || req.educationId() <= 0) {
                if (empEducationMapper.countPersonInCompany(req.personId(), companyId) == 0)
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                Long newId = empEducationMapper.selectNextEducationId();
                empEducationMapper.insertEducation(newId, req);
                resultIds.add(newId);
            } else {
                int cnt = empEducationMapper.updateEducation(req.educationId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.educationId());
            }
        }
        return resultIds.stream().map(empEducationMapper::selectEducationById).toList();
    }

    /** delete L58 (UpdateDataModel DELETE) */
    @Transactional
    public int deleteEducations(UserPrincipal user, List<Long> educationIds) {
        if (educationIds == null || educationIds.isEmpty()) return 0;
        return empEducationMapper.deleteEducations(educationIds, user.getCompanyId());
    }

    /** multiUpdate L35-51: 고른 사람마다 getSeq로 새 ID를 받아 같은 교육행을 INSERT */
    @Transactional
    public int copyEducation(UserPrincipal user, EducationCopyReq req) {
        Long companyId = user.getCompanyId();
        int cnt = 0;
        for (Long personId : req.personIds()) {
            Long newId = empEducationMapper.selectNextEducationId();
            int n = empEducationMapper.copyEducation(newId, req.educationId(), personId, companyId);
            if (n == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            cnt += n;
        }
        return cnt;
    }
}
