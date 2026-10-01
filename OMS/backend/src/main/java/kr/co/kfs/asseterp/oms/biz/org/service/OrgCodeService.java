package kr.co.kfs.asseterp.oms.biz.org.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRow;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeSaveReq;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeSearchParam;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgHistoryRes;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoRow;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgCodeMapper;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgHistoryMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

/**
 * 조직코드 (AS-IS server/org/Org01_Code). 조직은 org01_code(코드·개설·폐쇄) + org02_info(변경일별 이력: 이름·상위·레벨·정렬)로 관리한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgCodeService {

    private static final long ROOT_PARENT_ID = 0L;

    private final OrgCodeMapper orgCodeMapper;
    private final OrgHistoryMapper orgHistoryMapper;

    /** AS-IS selectByCompanyId: 기준일 회사 조직 트리 */
    public List<OrgCodeRes> searchOrgCodes(UserPrincipal user, LocalDate baseDate) {
        return orgCodeMapper.searchTree(new OrgCodeSearchParam(user.getCompanyId(), baseDate == null ? LocalDate.now() : baseDate, null));
    }

    /** 조직이 로그인 회사 것인지 확인 */
    public void requireOrg(UserPrincipal user, Long codeId) {
        if (codeId == null || !Objects.equals(orgCodeMapper.selectCompanyId(codeId), user.getCompanyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "조직을 찾을 수 없습니다. 다시 조회해 주세요.");
        }
    }

    /** AS-IS Org01_Edit_OrgCode(insertData) → update: 코드ID = 이력ID, 이력 변경일·사유 = 개설일·개설사유 */
    @Transactional
    public OrgCodeRes createOrgCode(UserPrincipal user, OrgCodeSaveReq req) {
        validate(req);
        if (req.parentCodeId() != null && req.parentCodeId() != ROOT_PARENT_ID) {
            requireOrg(user, req.parentCodeId());
        }
        Long id = orgCodeMapper.selectNextId();
        orgCodeMapper.insertInfo(infoRow(id, id, req, req.openDate(), req.openReason()));
        orgCodeMapper.insertCode(codeRow(id, user, req));
        return orgCodeMapper.selectByBaseDate(new OrgCodeSearchParam(user.getCompanyId(), req.openDate(), id));
    }

    /**
     * AS-IS Org02_Edit_Info → update: 편집 중인 이력의 변경일이 바뀌었으면 새 이력을 만들고(조직 변경), 같으면 그 이력을 고친다.
     * 조직코드(개설·폐쇄)도 함께 저장한다.
     */
    @Transactional
    public OrgCodeRes updateOrgCode(UserPrincipal user, Long codeId, OrgCodeSaveReq req) {
        requireOrg(user, codeId);
        validate(req);
        if (req.modDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "변경일은 필수입력 항목입니다");
        }
        if (req.openDate().isAfter(req.modDate())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "변경일은 개설일 이후여야 합니다");
        }
        if (codeId.equals(req.parentCodeId())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "동일한 조직은 등록할 수 없습니다");
        }
        if (req.parentCodeId() != null && req.parentCodeId() != ROOT_PARENT_ID) {
            requireOrg(user, req.parentCodeId());
        }
        OrgHistoryRes target = req.infoId() == null ? null : orgCodeMapper.selectInfo(req.infoId());
        if (target == null || !Objects.equals(target.codeId(), codeId)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "조직정보 이력을 찾을 수 없습니다. 다시 조회해 주세요.");
        }
        if (target.modDate().equals(req.modDate())) {
            orgCodeMapper.updateInfo(infoRow(req.infoId(), codeId, req, req.modDate(), req.modReason()));
        } else {
            orgCodeMapper.insertInfo(infoRow(orgCodeMapper.selectNextId(), codeId, req, req.modDate(), req.modReason()));
        }
        orgCodeMapper.updateCode(codeRow(codeId, user, req));
        return orgCodeMapper.selectByBaseDate(new OrgCodeSearchParam(user.getCompanyId(), req.modDate(), codeId));
    }

    /** AS-IS Org01_Code.delete: 이력이 여럿이면 그 이력만, 하나뿐이면 조직코드를 지운다 */
    @Transactional
    public void deleteOrgCode(UserPrincipal user, Long codeId, Long infoId) {
        requireOrg(user, codeId);
        if (orgCodeMapper.countInfos(codeId) > 1) {
            requireInfo(codeId, infoId);
            orgHistoryMapper.deleteInfo(infoId);
        } else {
            orgCodeMapper.deleteCode(codeId);
        }
    }

    /** AS-IS Org01_Edit_OrgCode.update 필수값 */
    private static void validate(OrgCodeSaveReq req) {
        if (req.openDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "개설일은 필수입력 항목입니다");
        }
        if (isBlank(req.openReason())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "개설사유는 필수입력 항목입니다");
        }
        if (isBlank(req.orgCd())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조직코드는 필수입력 항목입니다");
        }
        if (isBlank(req.levelCd())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조직레벨은 필수입력 항목입니다");
        }
        if (isBlank(req.korNm())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조직명은 필수입력 항목입니다");
        }
    }

    private static OrgInfoRow infoRow(Long infoId, Long codeId, OrgCodeSaveReq req, LocalDate modDate, String modReason) {
        return new OrgInfoRow(infoId, req.korNm().trim(), modDate, modReason, codeId,
                req.parentCodeId() == null ? ROOT_PARENT_ID : req.parentCodeId(),
                req.engNm(), req.note(), req.levelCd(), req.sortOrder(), null);
    }

    private static OrgCodeRow codeRow(Long codeId, UserPrincipal user, OrgCodeSaveReq req) {
        return new OrgCodeRow(codeId, user.getCompanyId(), req.orgCd().trim(), req.openDate(), req.closeDate(),
                req.openReason(), req.closeReason(), null);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    /** 이력 행이 그 조직의 것인지 확인 */
    public void requireInfo(Long codeId, Long infoId) {
        OrgHistoryRes info = infoId == null ? null : orgCodeMapper.selectInfo(infoId);
        if (info == null || !Objects.equals(info.codeId(), codeId)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "조직정보 이력을 찾을 수 없습니다. 다시 조회해 주세요.");
        }
    }
}
