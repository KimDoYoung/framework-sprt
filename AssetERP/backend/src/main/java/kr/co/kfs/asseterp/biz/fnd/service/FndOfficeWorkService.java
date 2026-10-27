package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkCompanySaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOfficeWorkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * AS-IS server/fnd/Fnd06_OfficeWork.java (selectByCompanyId L45 / selectByCompanyId0 L50 / preUpdate L115 / selectIcamOfficeWork L155 / update L198 / delete L203).
 * 사무수탁사정보 관리(관리자, D12)는 공통 회사(0) 전용이고, 사무수탁사정보 관리(R11, #1052)는 로그인 회사별 CRUD 화면이다.
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

    /** AS-IS fnd.Fnd06_OfficeWork.selectByText (P05 조회창) — 검색어는 서버가 %…%로 */
    public List<OfficeWorkRes> lookup(UserPrincipal user, String searchText) {
        return mapper.selectByText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS fnd.Fnd06_OfficeWork.selectByCompanyId (R11 #1052 사무수탁사정보 관리) */
    public List<OfficeWorkCompanyRes> searchCompany(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), String.valueOf(useYn), searchText == null ? "" : searchText);
    }

    /** AS-IS fnd.Fnd06_OfficeWork.preUpdate (L115-153) + update (L198-201, UpdateDataModel) */
    @Transactional
    public List<OfficeWorkCompanyRes> saveCompany(UserPrincipal user, List<OfficeWorkCompanySaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (OfficeWorkCompanySaveReq req : rows) {
            if (req.officeWorkCode() == null || req.officeWorkCode().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사무수탁사 코드를 입력하세요");
            }
            if (req.officeWorkName() == null || req.officeWorkName().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사무수탁사명을 입력하세요");
            }
            OfficeWorkCompanyRes found = (req.officeWorkId() == null || req.officeWorkId() <= 0)
                    ? null : mapper.selectCompanyById(req.officeWorkId());
            if (found != null && !found.companyId().equals(companyId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            boolean checkDup = (found == null) || !Objects.equals(req.officeWorkCode(), found.officeWorkCode());
            if (checkDup && mapper.countByCd(companyId, req.officeWorkCode()) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "동일한 사무수탁사코드가 존재합니다.");
            }
        }
        return rows.stream().map(req -> {
            OfficeWorkCompanyRes found = (req.officeWorkId() == null || req.officeWorkId() <= 0)
                    ? null : mapper.selectCompanyById(req.officeWorkId());
            if (found != null) {
                mapper.updateCompanyOfficeWork(req, companyId);
                return mapper.selectCompanyById(req.officeWorkId());
            }
            long newId = mapper.selectNextId();
            mapper.insertCompanyOfficeWork(newId, req, companyId);
            return mapper.selectCompanyById(newId);
        }).toList();
    }

    /** AS-IS fnd.Fnd06_OfficeWork.delete (L203-206, UpdateDataModel) */
    @Transactional
    public void deleteCompany(UserPrincipal user, List<Long> officeWorkIds) {
        if (officeWorkIds == null || officeWorkIds.isEmpty()) {
            return;
        }
        mapper.deleteCompanyOfficeWorks(user.getCompanyId(), officeWorkIds);
    }

    /** AS-IS fnd.Fnd06_OfficeWork.selectIcamOfficeWork (L155, R11 회사별 화면에서 호출) */
    public void importCompanyIcam(UserPrincipal user) {
        icamImporter.importOfficeWorks(user.getCompanyId());
    }
}
