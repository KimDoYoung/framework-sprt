package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOfficeWorkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/fnd/Fnd06_OfficeWork.java (selectByCompanyId0 L50 / update L198 / selectIcamOfficeWork L155).
 * 사무수탁사정보 관리(관리자)는 공통 회사(0) 전용 화면이라 저장·가져오기는 관리자 회사만 한다(보안 보강, D11과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndOfficeWorkService {

    private final FndOfficeWorkMapper mapper;
    private final FndIcamImporter icamImporter;

    /** AS-IS selectByCompanyId0: 로그인 회사가 0일 때만 행이 나온다(SQL이 company = 0 AND company = 로그인 회사) */
    public List<OfficeWorkRes> search(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId0(user.getCompanyId(), String.valueOf(useYn), searchText == null ? "" : searchText);
    }

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<OfficeWorkRes> save(UserPrincipal user, List<OfficeWorkSaveReq> rows) {
        requireSysAdmin(user);
        return rows.stream().map(req -> {
            OfficeWorkRes found = req.officeWorkId() == null ? null : mapper.selectById(req.officeWorkId());
            if (found != null && !found.companyId().equals(user.getCompanyId())) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            if (found != null) {
                mapper.updateOfficeWork(req);
                return mapper.selectById(req.officeWorkId());
            }
            long newId = mapper.selectNextId();
            mapper.insertOfficeWork(newId, req, user.getCompanyId());
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS selectIcamOfficeWork: 로그인 회사의 사무수탁사를 ICAM에서 가져온다 */
    public void importIcam(UserPrincipal user) {
        requireSysAdmin(user);
        icamImporter.importOfficeWorks(user.getCompanyId());
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
