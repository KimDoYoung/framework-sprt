package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentCompanySaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentRes;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndConsignmentMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * AS-IS server/fnd/Fnd03_Consignment.java (selectByCompanyId L34 / selectByCompanyId0 L39 / preUpdate L53 / insertCheck L93 / update L132 / delete L137 / selectIcamConsignment L142).
 * 수탁사정보 관리(관리자, D11)는 공통 회사(0) 전용이고, 수탁사정보 관리(R10, #1051)는 로그인 회사별 CRUD 화면이다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndConsignmentService {

    private final FndConsignmentMapper mapper;
    private final FndIcamImporter icamImporter;

    /** AS-IS selectByCompanyId0: 로그인 회사가 0일 때만 행이 나온다(SQL이 company = 0 AND company = 로그인 회사) */
    public List<ConsignmentRes> search(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId0(user.getCompanyId(), String.valueOf(useYn), searchText == null ? "" : searchText);
    }

    /** AS-IS insertCheck(GridUpdate): 있는 행은 코드·이름·사용여부·비고를 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<ConsignmentRes> save(UserPrincipal user, List<ConsignmentSaveReq> rows) {
        requireSysAdmin(user);
        return rows.stream().map(req -> {
            ConsignmentRes found = req.consignmentId() == null ? null : mapper.selectById(req.consignmentId());
            if (found != null && !found.companyId().equals(user.getCompanyId())) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            if (found != null) {
                mapper.updateConsignment(req);
                return mapper.selectById(req.consignmentId());
            }
            long newId = mapper.selectNextId();
            mapper.insertConsignment(newId, req, user.getCompanyId());
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS selectIcamConsignment: 공통 회사(0)이면 모든 회사("%") */
    public void importIcam(UserPrincipal user) {
        requireSysAdmin(user);
        icamImporter.importConsignments(user.getCompanyId() == 0 ? "%" : String.valueOf(user.getCompanyId()));
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** AS-IS fnd.Fnd03_Consignment.selectByText (P05 조회창) — 검색어는 서버가 %…%로 */
    public List<ConsignmentRes> lookup(UserPrincipal user, String searchText) {
        return mapper.selectByText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS fnd.Fnd03_Consignment.selectByCompanyId (R10 #1051 수탁사정보 관리) */
    public List<ConsignmentCompanyRes> searchCompany(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), String.valueOf(useYn), searchText == null ? "" : searchText);
    }

    /** AS-IS fnd.Fnd03_Consignment.preUpdate (L53-91) + update (L132-135, UpdateDataModel) */
    @Transactional
    public List<ConsignmentCompanyRes> saveCompany(UserPrincipal user, List<ConsignmentCompanySaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (ConsignmentCompanySaveReq req : rows) {
            ConsignmentCompanyRes found = (req.consignmentId() == null || req.consignmentId() <= 0)
                    ? null : mapper.selectCompanyById(req.consignmentId());
            if (found != null && !found.companyId().equals(companyId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            boolean checkDup = (found == null) || !Objects.equals(req.consignmentCode(), found.consignmentCode());
            if (checkDup && mapper.countByCd(companyId, req.consignmentCode()) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "동일한 수탁사코드가 존재합니다.");
            }
        }
        return rows.stream().map(req -> {
            ConsignmentCompanyRes found = (req.consignmentId() == null || req.consignmentId() <= 0)
                    ? null : mapper.selectCompanyById(req.consignmentId());
            if (found != null) {
                mapper.updateCompanyConsignment(req, companyId);
                return mapper.selectCompanyById(req.consignmentId());
            }
            long newId = mapper.selectNextId();
            mapper.insertCompanyConsignment(newId, req, companyId);
            return mapper.selectCompanyById(newId);
        }).toList();
    }

    /** AS-IS fnd.Fnd03_Consignment.delete (L137-140, UpdateDataModel) */
    @Transactional
    public void deleteCompany(UserPrincipal user, List<Long> consignmentIds) {
        if (consignmentIds == null || consignmentIds.isEmpty()) {
            return;
        }
        mapper.deleteCompanyConsignments(user.getCompanyId(), consignmentIds);
    }

    /** AS-IS fnd.Fnd03_Consignment.selectIcamConsignment (L142, R10 회사별 화면에서 호출) */
    public void importCompanyIcam(UserPrincipal user) {
        icamImporter.importConsignments(user.getCompanyId() == 0 ? "%" : String.valueOf(user.getCompanyId()));
    }
}
