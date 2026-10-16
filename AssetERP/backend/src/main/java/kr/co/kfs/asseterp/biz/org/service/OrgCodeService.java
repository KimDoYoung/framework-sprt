package kr.co.kfs.asseterp.biz.org.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeSaveReq;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoHistRes;
import kr.co.kfs.asseterp.biz.org.mapper.OrgCodeMapper;
import kr.co.kfs.asseterp.biz.org.mapper.OrgInfoHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/org/Org01_Code.java (selectByCompanyId / update / delete) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgCodeService {

    private final OrgCodeMapper orgCodeMapper;
    private final OrgInfoHistoryMapper orgInfoHistoryMapper;

    /** AS-IS selectByCompanyId L64-104 (rootOrgId 없음 → parentCodeId 0, 전체 조직). 전위 순서 + depth */
    public List<OrgCodeRes> searchOrgCodes(UserPrincipal user, LocalDate baseDate) {
        return orgCodeMapper.searchOrgCodes(user.getCompanyId(), baseDate);
    }

    /**
     * 신규 조직 (AS-IS Org01_Tab_OrgCode.insertOrgCode → Org01_Edit_OrgCode.update → Org01_Code.update L106-167).
     * 원본은 팝업을 열 때 getSeq로 codeId = infoId를 정한다 → 서버가 채번. 이력이 없으므로 변경일 = 개설일, 변경사유 = 개설사유.
     * org02_info → org01_code 순서로 INSERT 후 selectByBaseDate.
     */
    @Transactional
    public OrgCodeRes createOrgCode(UserPrincipal user, OrgCodeSaveReq in) {
        Long companyId = user.getCompanyId();
        if (in.openDate() == null) throw invalid("개설일은 필수입력 항목입니다");
        if (blank(in.openReason())) throw invalid("개설사유는 필수입력 항목입니다");
        if (blank(in.orgCd())) throw invalid("조직코드는 필수입력 항목입니다");
        if (blank(in.levelCd())) throw invalid("조직레벨은 필수입력 항목입니다");
        if (blank(in.korNm())) throw invalid("조직명은 필수입력 항목입니다"); // org02_kor_nm NOT NULL (원본은 DB 오류)
        if (in.parentCodeId() == null || (in.parentCodeId() != 0 && orgCodeMapper.countCode(companyId, in.parentCodeId()) == 0)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        Long seq = orgCodeMapper.selectNextId();
        OrgCodeSaveReq req = in.withIds(seq, seq).withMod(in.openDate(), in.openReason());
        orgCodeMapper.insertInfo(seq, req);
        orgCodeMapper.insertCode(companyId, req);
        return orgCodeMapper.selectByBaseDate(companyId, seq, baseDateOf(req));
    }

    /**
     * 조직 수정 (AS-IS Org02_Edit_Info.update / Org01_Edit_OrgCode.update(수정 모드) → Org01_Code.update L106-167).
     * org02_info.selectById로 원래 이력을 읽고, 변경일이 바뀌었으면 새 ID로 이력 INSERT, 같으면 UPDATE. 다음 org01_code UPDATE.
     */
    @Transactional
    public OrgCodeRes updateOrgCode(UserPrincipal user, Long codeId, OrgCodeSaveReq in) {
        Long companyId = user.getCompanyId();
        OrgCodeSaveReq req = in.withIds(codeId, in.infoId());
        OrgInfoHistRes target = orgInfoHistoryMapper.selectInfoById(companyId, req.infoId());
        if (target == null || !codeId.equals(target.codeId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        // 원본은 변경일이 비면 화면 비교에서 멈춘다(NPE). NOT NULL 컬럼은 미리 막는다(05 §6 DB 오류)
        if (req.modDate() == null) throw invalid("변경일은 필수입력 항목입니다");
        if (blank(req.modReason())) throw invalid("변경사유는 필수입력 항목입니다");
        if (blank(req.korNm())) throw invalid("조직명은 필수입력 항목입니다");
        if (blank(req.levelCd())) throw invalid("조직레벨은 필수입력 항목입니다");
        if (req.openDate() != null && req.openDate().isAfter(req.modDate())) throw invalid("변경일은 개설일 이후여야 합니다");
        if (req.parentCodeId() == null || (req.parentCodeId() != 0 && orgCodeMapper.countCode(companyId, req.parentCodeId()) == 0)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }

        if (!target.modDate().toLocalDate().equals(req.modDate())) {
            // 일자가 바뀌었다 → 새 키로 INSERT (유일 인덱스 org02_code_id + org02_mod_date)
            if (orgCodeMapper.countInfoByModDate(codeId, req.modDate(), target.infoId()) > 0) {
                throw invalid("같은 변경일의 조직정보가 이미 있습니다");
            }
            orgCodeMapper.insertInfoHistory(orgCodeMapper.selectNextId(), target.infoId(), req);
        } else {
            orgCodeMapper.updateInfo(companyId, req);
        }
        orgCodeMapper.updateCode(companyId, req);
        return orgCodeMapper.selectByBaseDate(companyId, codeId, baseDateOf(req));
    }

    /**
     * 조직 삭제 (AS-IS Org01_Code.delete L169-219): 이력이 2건 이상이면 그 이력(org02_info)만, 아니면 org01_code 행만 지운다(원본 그대로).
     * 이 화면에서는 호출 경로가 없다(Org01_Edit_OrgCode 수정 모드·Org02_Edit_Info.deleteCheck).
     */
    @Transactional
    public int deleteOrgCode(UserPrincipal user, Long codeId, Long infoId) {
        Long companyId = user.getCompanyId();
        if (orgCodeMapper.countCode(companyId, codeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (orgCodeMapper.countInfoByCodeId(codeId) > 1) {
            return orgCodeMapper.deleteInfo(companyId, infoId);
        }
        return orgCodeMapper.deleteCode(companyId, codeId);
    }

    private static LocalDate baseDateOf(OrgCodeSaveReq req) {
        return req.baseDate() != null ? req.baseDate() : LocalDate.now();
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
