package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FileMonthRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileTotalParam;
import kr.co.kfs.asseterp.biz.sys.dto.FileTotalRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileYearRes;
import kr.co.kfs.asseterp.biz.sys.dto.TrashFileRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFileMapper;
import kr.co.kfs.asseterp.common.config.properties.UploadProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * 파일 공통 (B10) — AS-IS 서블릿 FileUpload(uploadFile·uploadEmpFile)·FileDownload(file·image)·FileDelete(deleteFile)와 server/sys/Sys10_File.selectByParentId.
 * 저장: {asseterp.upload.dir}/{로그인 회사코드}/{yyyyMM}/{fileId}(확장자 없음), sys10_server_path = 그 폴더 (AS-IS FileUpload.uploadFolder).
 * 사용자 결정(2026-10-13): 형식 검사(asseterp.upload.allowed-types, Tika 내용 판별)는 TOBE에서 더한다. 권한은 로그인만(원본도 검사 없음).
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysFileService {

    /** AS-IS FileUpload mode=emp01 (사원 사진) */
    public static final String MODE_EMP01 = "emp01";
    private static final String NONAMED_IMAGE = "nonamed.jpg";
    private static final Tika TIKA = new Tika();

    private final SysFileMapper sysFileMapper;
    private final UploadProperties uploadProperties;
    private final AuditLogService auditLogService;

    /** 받을 파일 (실제 위치·내려줄 이름·Content-Type) */
    public record StoredFile(File file, String fileNm, String contentType) {
    }

    /** AS-IS Sys10_File.selectByParentId L52 */
    public List<FileRes> searchByParentId(Long parentId) {
        return sysFileMapper.selectByParentId(parentId);
    }

    /** AS-IS Sys10_File.selectByTotalSize L180 (A16 고객별 서버사용량) — 관리자 메뉴라 sys admin만 */
    public List<FileTotalRes> selectByTotalSize(UserPrincipal user, boolean useYn) {
        requireSysAdmin(user);
        return sysFileMapper.selectByTotalSize(String.valueOf(useYn));
    }

    /** AS-IS Sys10_File.selectByTotalSizeYear L188 */
    public List<FileYearRes> selectByTotalSizeYear(UserPrincipal user, String locName) {
        requireSysAdmin(user);
        return sysFileMapper.selectByTotalSizeYear(new FileTotalParam(locName, null));
    }

    /** AS-IS Sys10_File.selectByTotalSizeMonth L196 */
    public List<FileMonthRes> selectByTotalSizeMonth(UserPrincipal user, String locName, String year) {
        requireSysAdmin(user);
        return sysFileMapper.selectByTotalSizeMonth(new FileTotalParam(locName, year));
    }

    /** AS-IS Sys10_File.findTrashFile L257 (A17 미사용 파일조회) — 관리자 메뉴라 sys admin만 */
    public List<TrashFileRes> findTrashFile(UserPrincipal user) {
        requireSysAdmin(user);
        return sysFileMapper.findTrashFile();
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /**
     * AS-IS FileUpload.uploadFile L131-178 / uploadEmpFile L748-812 → 저장된 행.
     * 원본은 폼 항목마다 행을 만들었지만(결함, B10-작업방법 2절) 여기서는 파일 하나만 받는다.
     */
    @Transactional
    public FileRes upload(UserPrincipal user, Long parentId, String mode, String fileYn, MultipartFile upload) {
        if (upload == null || upload.isEmpty() || upload.getOriginalFilename() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        String fileNm = upload.getOriginalFilename();
        String ext = fileNm.substring(fileNm.lastIndexOf('.') + 1); // makeFileModel L861
        checkAllowedType(user, fileNm, ext, upload);

        Long fileId = sysFileMapper.selectNextId();
        String serverPath = uploadFolder(user.getCompanyCode());
        File target = new File(serverPath, fileId.toString());
        try {
            File subDir = new File(serverPath);
            if (!subDir.exists() && !subDir.mkdirs()) {
                throw new IOException("폴더를 만들 수 없습니다: " + serverPath);
            }
            // uploadEmpFile L792: 사원이 있고 jpg·jpeg·png면 800×600으로 줄여 저장
            if (MODE_EMP01.equalsIgnoreCase(mode) && isImageFile(fileNm) && sysFileMapper.countPersonById(parentId) > 0) {
                ImageIO.write(resizeImage(upload, 800, 600), ext, target);
            } else {
                upload.transferTo(target);
            }
        } catch (IOException e) {
            log.error("파일 생성시 오류발생 fileId={}", fileId, e);
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "파일 업로드 중 오류가 발생하였습니다.");
        }

        try {
            // makeFileModel L862: 크기는 KB(정수 나눗셈), fileYn은 checkNull("true"만 true)
            sysFileMapper.insertFile(fileId, parentId, fileNm, serverPath, (double) (upload.getSize() / 1024), ext,
                    "true".equals(fileYn) ? "true" : "false");
        } catch (RuntimeException e) {
            deletePhysical(target, fileId);
            throw e;
        }
        auditLogService.record(AuditEventType.FILE_UPLOAD, AuditResult.SUCCESS, user.getUsername(), fileId.toString(), fileNm);
        return sysFileMapper.selectById(fileId);
    }

    /** AS-IS FileDownload.downloadFile L162-184 (fileType=file) */
    public StoredFile getDownload(UserPrincipal user, Long fileId) {
        FileRes fileModel = sysFileMapper.selectById(fileId);
        if (fileModel == null) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "등록된 파일정보를 찾을 수 없습니다.");
        }
        File file = new File(fileModel.serverPath(), fileModel.fileId().toString());
        if (!file.exists()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "서버에 등록된 파일정보가 없습니다: " + fileModel.fileNm());
        }
        auditLogService.record(AuditEventType.FILE_DOWNLOAD, AuditResult.SUCCESS, user.getUsername(), fileId.toString(), fileModel.fileNm());
        return new StoredFile(file, fileModel.fileNm(), "application/octet-stream");
    }

    /**
     * AS-IS FileDownload.downloadSelectList L257-280 (fileType=selectList): 고른 파일들을 zip 하나로. 없는 파일·서버에 없는 파일은 건너뛰고,
     * 이름은 "(번호) 파일명"(번호는 실제로 담긴 순서)
     */
    public List<StoredFile> getZipEntries(UserPrincipal user, List<Long> fileIds) {
        if (fileIds == null || fileIds.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "파일 리스트가 없습니다.");
        }
        List<StoredFile> entries = new ArrayList<>();
        for (Long fileId : fileIds) {
            FileRes fileModel = sysFileMapper.selectById(fileId);
            if (fileModel == null) {
                continue;
            }
            File file = new File(fileModel.serverPath(), fileModel.fileId().toString());
            if (!file.exists()) {
                continue;
            }
            auditLogService.record(AuditEventType.FILE_DOWNLOAD, AuditResult.SUCCESS, user.getUsername(), fileId.toString(), fileModel.fileNm());
            entries.add(new StoredFile(file, "(" + (entries.size() + 1) + ") " + fileModel.fileNm(), "application/octet-stream"));
        }
        return entries;
    }

    /**
     * AS-IS FileDownload.downloadApprList L281-310 (fileType=apprList, F09): 고른 문서들의 본문·첨부파일을 zip 하나로("Asset-ERP_DOC.zip").
     * 본문(titleYn=true)은 "(번호) [본문] 파일명", 첨부는 "(번호-순번) [첨부파일] 파일명"이고 그 앞에 담긴 순서 "(n) "이 한 번 더 붙는다. 서버에 없는 파일은 건너뛴다
     */
    public List<StoredFile> getApprZipEntries(UserPrincipal user, List<Long> apprIds) {
        if (apprIds == null || apprIds.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "파일 리스트가 없습니다.");
        }
        List<FileRes> files = new ArrayList<>();
        List<String> names = new ArrayList<>();
        int mainNumber = 1;
        int subNumber = 1;
        for (Long apprId : apprIds) {
            for (FileRes fileModel : sysFileMapper.selectByApprId(apprId)) {
                if ("true".equals(fileModel.titleYn())) {
                    subNumber = 1;
                    names.add("(" + mainNumber + ") [본문] " + fileModel.fileNm());
                } else {
                    mainNumber--;
                    names.add("(" + mainNumber + "-" + subNumber + ") [첨부파일] " + fileModel.fileNm());
                    subNumber++;
                }
                files.add(fileModel);
                mainNumber++;
            }
        }
        List<StoredFile> entries = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            FileRes fileModel = files.get(i);
            File file = new File(fileModel.serverPath(), fileModel.fileId().toString());
            if (!file.exists()) {
                continue;
            }
            auditLogService.record(AuditEventType.FILE_DOWNLOAD, AuditResult.SUCCESS, user.getUsername(), fileModel.fileId().toString(), fileModel.fileNm());
            entries.add(new StoredFile(file, "(" + (entries.size() + 1) + ") " + names.get(i), "application/octet-stream"));
        }
        return entries;
    }

    /** AS-IS FileDownload.downloadGenericImage L195-215 (fileType=image): fileId 또는 parentId의 최근 1건, 없으면 {업로드 폴더}/nonamed.jpg */
    public StoredFile getImage(Long fileId, Long parentId) {
        FileRes fileModel = null;
        if (fileId != null) {
            fileModel = sysFileMapper.selectById(fileId);
        } else if (parentId != null) {
            fileModel = sysFileMapper.selectOneByParentId(parentId);
        }
        File file = fileModel != null ? new File(fileModel.serverPath(), fileModel.fileId().toString()) : null;
        if (file == null || !file.exists()) {
            file = new File(uploadProperties.dir(), NONAMED_IMAGE);
            if (!file.exists()) {
                throw new BusinessException(ErrorCode.FILE_NOT_FOUND); // 원본은 기본 이미지가 늘 있다 — 여기서는 없으면 404
            }
            return new StoredFile(file, NONAMED_IMAGE, "image/jpg");
        }
        return new StoredFile(file, fileModel.fileNm(), "image/" + fileModel.fileExt());
    }

    /** AS-IS FileDelete.deleteFile L154-192: 실제 파일을 지우고(실패해도 로그만) sys10_file 행을 지운다 */
    @Transactional
    public void delete(Long fileId) {
        FileRes fileModel = sysFileMapper.selectById(fileId);
        if (fileModel == null) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "등록된 파일정보를 찾을 수 없습니다.");
        }
        deletePhysical(new File(fileModel.serverPath(), fileId.toString()), fileId);
        sysFileMapper.deleteById(fileId);
    }

    /** TOBE 추가(사용자 결정): 확장자가 allowed-types에 있고, Tika가 내용으로 판별한 MIME이 그 확장자의 허용 목록에 있어야 한다 */
    private void checkAllowedType(UserPrincipal user, String fileNm, String ext, MultipartFile upload) {
        Set<String> allowed = uploadProperties.allowedTypes() == null ? null
                : uploadProperties.allowedTypes().get(ext.toLowerCase(Locale.ROOT));
        String detected;
        try (InputStream in = new BufferedInputStream(upload.getInputStream())) {
            detected = TIKA.detect(in);
        } catch (IOException e) {
            detected = null;
        }
        if (allowed == null || detected == null || !allowed.contains(detected)) {
            auditLogService.record(AuditEventType.FILE_UPLOAD_REJECTED, AuditResult.FAIL, user.getUsername(), null,
                    fileNm + " (" + detected + ")");
            throw new BusinessException(ErrorCode.INVALID_FILE);
        }
    }

    /** AS-IS FileUpload.uploadFolder L927-936 */
    private String uploadFolder(String companyLoc) {
        String path = uploadProperties.dir();
        if (path.endsWith("/") || path.endsWith("\\")) {
            path = path.substring(0, path.length() - 1);
        }
        return path + "/" + (companyLoc == null ? "unknown" : companyLoc) + "/" + new SimpleDateFormat("yyyyMM").format(new Date());
    }

    private static void deletePhysical(File file, Long fileId) {
        if (file.delete()) {
            log.info("삭제 성공 fileId : {}", fileId);
        } else {
            log.info("삭제 실패 fileId : {}", fileId);
        }
    }

    /** AS-IS FileUpload.isImageFile L814-817 */
    private static boolean isImageFile(String fileName) {
        String lower = fileName.toLowerCase(Locale.ROOT);
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
    }

    /** AS-IS FileUpload.resizeImage L823-846 */
    private static BufferedImage resizeImage(MultipartFile upload, int maxWidth, int maxHeight) throws IOException {
        BufferedImage originalImage;
        try (InputStream in = upload.getInputStream()) {
            originalImage = ImageIO.read(in);
        }
        float aspectRatio = (float) originalImage.getWidth() / originalImage.getHeight();
        int newWidth = maxWidth;
        int newHeight = maxHeight;
        if (aspectRatio > 1) {
            newHeight = Math.round(maxWidth / aspectRatio);
        } else {
            newWidth = Math.round(maxHeight * aspectRatio);
        }
        Image resized = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
        BufferedImage result = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = result.createGraphics();
        g2d.drawImage(resized, 0, 0, null);
        g2d.dispose();
        return result;
    }
}
