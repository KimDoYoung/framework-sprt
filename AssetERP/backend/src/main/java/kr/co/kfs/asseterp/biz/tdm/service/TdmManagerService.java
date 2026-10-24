package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerInfoRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManagerSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManagerMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 책무담당자 등록 (AS-IS server/tdm/Tdm08_ManagerInfo) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManagerService {

    private final TdmManagerMapper mapper;

    /** AS-IS tdm.Tdm08_ManagerInfo.selectByCompanyId (searchText는 '%…%'로 감싼다) */
    public List<ManagerRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByCompanyId(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS tdm.Tdm08_ManagerInfo.selectByManagerType */
    public List<ManagerInfoRes> searchInfos(UserPrincipal user, String managerType, Long orgId) {
        return mapper.selectByManagerType(user.getCompanyId(), managerType, orgId);
    }

    /** AS-IS Tdm08_ManagerInfo.update (UpdateDataModel): ID ≤ 0이면 INSERT, 아니면 담당자·적용기간 UPDATE. 저장한 행을 요청 순서로 돌려준다 */
    @Transactional
    public List<ManagerInfoRes> save(UserPrincipal user, List<ManagerSaveReq> rows) {
        List<Long> ids = new ArrayList<>();
        for (ManagerSaveReq row : rows) {
            if (row.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "적용시작일을 입력하세요");
            }
            if (row.personId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "담당자를 선택하세요");
            }
            if (row.managerInfoId() == null || row.managerInfoId() <= 0) {
                if (row.managerType() == null || row.managerType().isBlank()) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT);
                }
                Long newId = mapper.selectNextId();
                mapper.insertManager(newId, user.getCompanyId(), row, user.getName());
                ids.add(newId);
            } else {
                checkCompany(user, row.managerInfoId());
                mapper.updateManager(row, user.getName());
                ids.add(row.managerInfoId());
            }
        }
        return ids.stream().map(mapper::selectById).toList();
    }

    /** AS-IS Tdm08_ManagerInfo.delete (UpdateDataModel.deleteModel) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> managerInfoIds) {
        if (managerInfoIds == null || managerInfoIds.isEmpty()) {
            return 0;
        }
        for (Long id : managerInfoIds) {
            checkCompany(user, id);
        }
        return mapper.deleteManagers(user.getCompanyId(), managerInfoIds);
    }

    /** 담당자 행이 로그인 회사 것이어야 한다 */
    private void checkCompany(UserPrincipal user, Long managerInfoId) {
        Long companyId = mapper.selectCompanyId(managerInfoId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
