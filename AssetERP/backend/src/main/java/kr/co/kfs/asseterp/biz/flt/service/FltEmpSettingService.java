package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.EmpOathRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpSettingRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpSettingSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltEmpSettingMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 임직원매매 기본설정 (Flt02_Lookup_Emp, EE45) — 로그인 사원 본인 것만 다룬다.
 * AS-IS server/flt/Flt02_Emp.java (selectByPersonId L25, update L54, delete L59) · Flt04_Oath.java (selectByPersonId L26, updateApprId L45)
 * · Flt07_FamilyConsent.deleteByFamilyConsentId L22 · FileUpload.uploadFlt07
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltEmpSettingService {

    private final FltEmpSettingMapper mapper;
    private final SysFileService sysFileService;

    /** AS-IS Flt02_Lookup_Emp.retrieve() L483-495: flt.Flt02_Emp.selectByPersonId(회사, 로그인 사원) */
    public List<EmpSettingRes> search(UserPrincipal user) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId());
    }

    /** AS-IS Flt02_Lookup_Emp.update() L509-529 (적용시작일자·보고주기 필수는 화면이 검사했다) → 요청과 같은 순서의 저장된 행 */
    @Transactional
    public List<EmpSettingRes> save(UserPrincipal user, List<EmpSettingSaveReq> list) {
        List<EmpSettingRes> saved = new ArrayList<>();
        for (EmpSettingSaveReq r : list) {
            if (r.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "적용시작일자를 입력하세요");
            }
            if (r.checkCycle() == null || r.checkCycle().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "보고주기를 선택하세요");
            }
            Long id = r.empId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insert(id, user.getCompanyId(), user.getUserId(), r.startDate(), r.yearInvestLimit(), r.checkCycle());
            } else if (mapper.update(id, user.getCompanyId(), user.getUserId(), r.startDate(), r.yearInvestLimit(), r.checkCycle()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "설정 정보를 찾을 수 없습니다.");
            }
            saved.add(mapper.selectById(user.getCompanyId(), user.getUserId(), id));
        }
        return saved;
    }

    /** AS-IS Flt02_Lookup_Emp.delete() L559-563 → 지운 건수. 본인 행만 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), user.getUserId(), ids);
    }

    /** AS-IS Flt02_Lookup_Emp.retrieveApprStep() L441-481: 서약서가 없으면 null(화면이 "미상신"). 여러 행이면 마지막 */
    public EmpOathRes oath(UserPrincipal user) {
        List<EmpOathRes> list = mapper.selectOathByPersonId(user.getCompanyId(), user.getUserId());
        return list.isEmpty() ? null : list.get(list.size() - 1);
    }

    /** AS-IS Flt04_Oath.updateApprId L45-66: 상신일(문서의 상신일) 서약서 행이 없으면 INSERT, 있으면 UPDATE */
    @Transactional
    public int updateOathApprId(UserPrincipal user, Long apprId) {
        LocalDate regDate = apprId == null ? null : mapper.selectApprRegDate(user.getCompanyId(), apprId);
        if (regDate == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신문서를 찾을 수 없습니다.");
        }
        if (mapper.countOathByStartDate(user.getCompanyId(), user.getUserId(), regDate) == 0) {
            return mapper.insertOathApprId(user.getCompanyId(), user.getUserId(), regDate, apprId);
        }
        return mapper.updateOathApprId(user.getCompanyId(), user.getUserId(), regDate, apprId);
    }

    /** AS-IS FileUpload?mode=flt07&personId= (uploadFlt07): 파일마다 flt07_family_consent 한 행을 만들고 그 ID를 부모로 파일을 올린다 */
    @Transactional
    public FileRes uploadFamilyConsent(UserPrincipal user, MultipartFile file) {
        Long consentId = mapper.selectNextId();
        mapper.insertFamilyConsent(consentId, user.getUserId());
        return sysFileService.upload(user, consentId, "flt07", "false", file);
    }

    /** AS-IS flt.Flt07_FamilyConsent.deleteByFamilyConsentId (파일 삭제 확인 전에 동의서 행부터) → 지운 건수. 본인 행만 */
    @Transactional
    public int deleteFamilyConsent(UserPrincipal user, Long consentId) {
        return mapper.deleteFamilyConsent(consentId, user.getUserId());
    }
}
