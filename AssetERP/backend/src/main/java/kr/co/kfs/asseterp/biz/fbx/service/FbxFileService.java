package kr.co.kfs.asseterp.biz.fbx.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxFileRes;
import kr.co.kfs.asseterp.biz.fbx.mapper.FbxBoxMapper;
import kr.co.kfs.asseterp.biz.fbx.mapper.FbxFileMapper;
import kr.co.kfs.asseterp.biz.fbx.mapper.FbxHistoryMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

/**
 * AS-IS server/fbx/Fbx03_File.selectByOrgAuth L106 (Fbx01_TabPage_DocList) + 서블릿 FileUpload.uploadFbx03 L250·FileDelete.deleteFileBox L62·FileDownload.downloadFbxFile L218.
 * 첨부(sys10_file)는 fbx03_file_id를 parent id로 한다. 업로드·삭제·다운로드마다 fbx02_history에 기록(01 생성·99 삭제·04 다운로드)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FbxFileService {

    private final FbxFileMapper fileMapper;
    private final FbxBoxMapper boxMapper;
    private final FbxHistoryMapper historyMapper;
    private final SysFileService sysFileService;
    private final EmpTransInfoService transInfoService;

    /** AS-IS selectByOrgAuth L106: 선택한 문서분류와 그 하위, 문서권한(조직·사원) 또는 내가 올린 파일 */
    public List<FbxFileRes> search(UserPrincipal user, Long boxId, Long classTreeId) {
        return fileMapper.selectByOrgAuth(user.getCompanyId(), boxId, classTreeId, orgIdOf(user), user.getUserId());
    }

    /** AS-IS uploadFbx03 L250-327: 파일마다 fbx03 + 첨부 + 기록(01). 빈 파일은 건너뛴다. 하나라도 실패하면 모두 되돌린다 → 올린 건수 */
    @Transactional
    public int upload(UserPrincipal user, Long boxId, Long classTreeId, List<MultipartFile> files) {
        if (boxMapper.selectCrtEmpIds(user.getCompanyId(), List.of(boxId)).isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        Long orgId = orgIdOf(user);
        int count = 0;
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            Long fileId = fileMapper.selectNextId();
            fileMapper.insertFile(fileId, boxId, classTreeId, orgId, user.getUserId());
            FileRes saved = sysFileService.upload(user, fileId, null, "false", file);
            historyMapper.insertHistory(boxId, "01", user.getUserId(), saved.fileNm(), orgId);
            count++;
        }
        return count;
    }

    /**
     * AS-IS deleteFileBox L62-120: fbx03 행 삭제 → 기록(99, 첨부 파일명). 등록자만("등록자만 파일삭제가 가능합니다" — 원본은 화면 검사).
     * 원본은 첨부 행·실제 파일도 지우려 했지만 fbx03_file_id(=parent id)를 첨부 행 ID·파일 이름으로 잘못 써서 실제로는 지워지지 않았다 — 그 결과(첨부는 남김)를 그대로 따른다
     */
    @Transactional
    public void delete(UserPrincipal user, Long boxId, Long fileId) {
        FbxFileRes owned = fileMapper.selectOwned(user.getCompanyId(), boxId, fileId);
        if (owned == null) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
        if (!user.getUserId().equals(owned.empId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "등록자만 파일삭제가 가능합니다");
        }
        FileRes attach = firstAttach(fileId);
        fileMapper.deleteFile(fileId);
        historyMapper.insertHistory(boxId, "99", user.getUserId(), attach.fileNm(), orgIdOf(user));
    }

    /** AS-IS downloadFbxFile L218-254: 첨부 한 건을 내려주고 기록(04) */
    @Transactional
    public SysFileService.StoredFile download(UserPrincipal user, Long boxId, Long fileId) {
        if (fileMapper.selectOwned(user.getCompanyId(), boxId, fileId) == null) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "등록된 파일정보를 찾을 수 없습니다.");
        }
        FileRes attach = firstAttach(fileId);
        File file = new File(attach.serverPath(), attach.fileId().toString());
        if (!file.exists()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "서버에 등록된 파일정보가 없습니다: " + attach.fileNm());
        }
        historyMapper.insertHistory(boxId, "04", user.getUserId(), attach.fileNm(), orgIdOf(user));
        return new SysFileService.StoredFile(file, attach.fileNm(), "application/octet-stream");
    }

    /** AS-IS sys10_file.selectByParentId의 첫 행 */
    private FileRes firstAttach(Long fileId) {
        List<FileRes> list = sysFileService.searchByParentId(fileId);
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "등록된 파일정보를 찾을 수 없습니다.");
        }
        return list.get(0);
    }

    /** LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    private Long orgIdOf(UserPrincipal user) {
        return user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
    }
}
