package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.FormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.FormFileSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmFormFileMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 이행점검 연관양식 등록 (AS-IS Tdm43_Tab_RelateFormFileUpload → sys.Sys10_File, 서블릿 FileUpload?mode=tdmCheckForm) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmFormFileService {

    private final TdmFormFileMapper mapper;
    private final SysFileService fileService;

    /** AS-IS sys.Sys10_File.getTdmCheckFormFile — 회사는 로그인 회사(원본이 sys10_parent_id에 회사 ID를 넣는다). formType은 '%'(전체)·코드 */
    public List<FormFileRes> search(UserPrincipal user, String formType, String searchText) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectFormFiles(user.getCompanyId(), formType == null || formType.isEmpty() ? "%" : formType, like);
    }

    /** AS-IS sys.Sys10_File.update(UpdateDataModel) — 바뀐 행의 구분·비고. 회사가 다른 파일이면 404 */
    @Transactional
    public void save(UserPrincipal user, List<FormFileSaveReq> rows) {
        for (FormFileSaveReq row : rows == null ? List.<FormFileSaveReq>of() : rows) {
            if (mapper.updateFormFile(user.getCompanyId(), row.fileId(), row.tdmCheckFormType(), row.note()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
    }

    /** AS-IS FileUpload.uploadTdmForm L592 — 파일(sys10_file, parentId=회사)을 올리고 구분·비고·등록자를 채운다 */
    @Transactional
    public FileRes upload(UserPrincipal user, String formType, String note, MultipartFile file) {
        if (formType == null || formType.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "구분을 선택하세요");
        }
        FileRes saved = fileService.upload(user, user.getCompanyId(), null, null, file);
        mapper.updateUploaded(saved.fileId(), formType, note == null ? "" : note, user.getUserId());
        return saved;
    }
}
