package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileAdminRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileAdminSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsFormFileAdminMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * AS-IS Ics01_Tab_IcsFileUpload → server/sys/Sys10_File.java (getIcsFile L81 / update L363) + 서블릿 FileUpload.uploadIcs01 L542.
 * 법규 보고 서식파일(sys10_file, parent_id 0) 관리. 쓰기는 관리자 회사만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsFormFileAdminService {

    private final IcsFormFileAdminMapper mapper;
    private final SysFileService sysFileService;

    /** AS-IS sys.Sys10_File.getIcsFile: lawType 없음(전체)은 '%', 검색어는 %…% */
    public List<IcsFormFileAdminRes> search(String lawType, String searchText) {
        String type = (lawType == null || lawType.isBlank()) ? "%" : lawType;
        return mapper.selectIcsFile(type, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS sys.Sys10_File.update(GridUpdate): 바꾼 행의 내용을 저장 → 저장된 행(요청 순서) */
    @Transactional
    public List<IcsFormFileAdminRes> save(UserPrincipal user, List<IcsFormFileAdminSaveReq> rows) {
        IcsClassTreeService.requireSysAdmin(user);
        return rows.stream().map(r -> {
            if (mapper.updateNote(r.fileId(), r.note()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "서식파일을 찾을 수 없습니다.");
            }
            return mapper.selectById(r.fileId());
        }).toList();
    }

    /** AS-IS FileUpload?mode=ics01: 파일 하나를 올리고(parentId 0, fileYn true) 법령구분·관리자등록·내용을 채운다 */
    @Transactional
    public IcsFormFileAdminRes upload(UserPrincipal user, String lawType, String note, MultipartFile file) {
        IcsClassTreeService.requireSysAdmin(user);
        if (lawType == null || lawType.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "법령구분을 선택해주세요");
        }
        FileRes saved = sysFileService.upload(user, 0L, null, "true", file);
        mapper.updateUploadMeta(saved.fileId(), lawType, note);
        return mapper.selectById(saved.fileId());
    }
}
