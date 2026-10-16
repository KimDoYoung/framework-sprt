package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.ManagementTeamRes;
import kr.co.kfs.asseterp.biz.sys.dto.ManagementTeamSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysManagementTeamMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys92_ManagementTeam.java (selectByAll L22 / update L28 / delete L33). 조회는 모든 회사, 저장·삭제는 관리자 회사(원본 화면이 그 회사에만 버튼을 보임) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysManagementTeamService {

    private final SysManagementTeamMapper mapper;

    public List<ManagementTeamRes> search() {
        return mapper.selectByAll();
    }

    /** AS-IS update(UpdateDataModel): 행마다 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<ManagementTeamRes> update(UserPrincipal user, List<ManagementTeamSaveReq> rows) {
        requireSysAdmin(user);
        List<ManagementTeamRes> saved = new ArrayList<>();
        for (ManagementTeamSaveReq req : rows) {
            boolean isNew = req.managementTeamId() == null || req.managementTeamId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.managementTeamId();
            if (isNew) {
                mapper.insertManagementTeam(id, req);
            } else if (mapper.updateManagementTeam(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            // 사원을 안 고른 행은 INNER JOIN(selectById)에 안 나온다 — 원본은 그 행을 화면에 못 돌려주지만 TOBE는 저장한 값을 돌려준다
            ManagementTeamRes row = mapper.selectById(id);
            saved.add(row != null ? row : mapper.selectRawById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteManagementTeams(ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
