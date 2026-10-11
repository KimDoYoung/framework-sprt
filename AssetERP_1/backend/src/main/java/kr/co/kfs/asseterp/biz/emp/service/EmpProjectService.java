package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ProjectRes;
import kr.co.kfs.asseterp.biz.emp.dto.ProjectSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpProjectMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/emp13_project.xml */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpProjectService {

    private final EmpProjectMapper empProjectMapper;

    public List<ProjectRes> getProjects(UserPrincipal user, Long personId) {
        return empProjectMapper.selectProjects(user.getCompanyId(), personId);
    }

    @Transactional
    public List<ProjectRes> updateProjects(UserPrincipal user, List<ProjectSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (ProjectSaveReq req : rows) {
            if (req.projectId() == null || req.projectId() <= 0) {
                Long newId = empProjectMapper.selectNextProjectId();
                empProjectMapper.insertProject(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empProjectMapper.updateProject(req.projectId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.projectId());
            }
        }
        return resultIds.stream().map(empProjectMapper::selectProjectById).toList();
    }

    @Transactional
    public int deleteProjects(UserPrincipal user, List<Long> projectIds) {
        if (projectIds == null || projectIds.isEmpty()) return 0;
        return empProjectMapper.deleteProjects(projectIds, user.getCompanyId());
    }
}
