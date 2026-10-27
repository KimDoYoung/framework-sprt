package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.AstManagerRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstManagerSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.Ast10ManagerMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class Ast10ManagerService {

    private final Ast10ManagerMapper mapper;

    public List<AstManagerRes> selectByLinkId(UserPrincipal user, Long linkId) {
        return mapper.selectByLinkId(user.getCompanyId(), linkId);
    }

    @Transactional
    public void saveManagers(UserPrincipal user, Long linkId, List<AstManagerSaveReq> managers) {
        for (AstManagerSaveReq req : managers) {
            if (req.managerId() == null || req.managerId() <= 0) {
                long newId = mapper.selectNextId();
                mapper.insertManager(newId, user.getCompanyId(), linkId, req);
            } else {
                mapper.updateManager(user.getCompanyId(), req);
            }
        }
    }

    @Transactional
    public void deleteManagers(UserPrincipal user, List<Long> managerIds) {
        for (Long id : managerIds) {
            mapper.deleteManager(id);
        }
    }
}
