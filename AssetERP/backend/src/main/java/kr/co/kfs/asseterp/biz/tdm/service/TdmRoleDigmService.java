package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmCompanyParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmCompanyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmParam;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleDigmMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 책무체계도 재생성(AS-IS Tdm32_Tab_RoleDigmAdmin)·작성(Tdm32_Tab_RoleDigm) → server/tdm/Tdm32_RoleDigm·Tdm33_RoleDigmFile */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmRoleDigmService {

    private final TdmRoleDigmMapper mapper;
    private final RoleDigmPdfMaker pdfMaker;
    private final SysFileService sysFileService;

    /**
     * AS-IS tdm.Tdm32_RoleDigm.selectByRegDateAdmin.
     * 회사: KFS 관리자는 고른 회사(없으면 전체), 그 밖에는 로그인 회사. 일자 범위는 전체보기가 아닐 때만 건다.
     */
    public List<RoleDigmRes> search(UserPrincipal user, Long companyId, String startDate, String closeDate, boolean endYn, boolean notPeriodYn) {
        Long scope = user.isSysAdmin() ? companyId : user.getCompanyId();
        return mapper.selectByRegDateAdmin(new RoleDigmParam(scope, startDate, closeDate, endYn, notPeriodYn));
    }

    /** AS-IS tdm.Tdm33_RoleDigmFile.selectByFileType 의 파일정보 ID들 (화면이 건수와 첫 건을 쓴다). 회사 범위는 행의 회사로 검사 */
    public List<Long> fileIds(UserPrincipal user, Long roleDigmId, String fileType) {
        requireScope(user, roleDigmId);
        return mapper.selectFileIdByFileType(roleDigmId, fileType);
    }

    /**
     * 한 건 재생성 (AS-IS createRd: 파일 확인·삭제 Tdm32_RoleDigm.fileCheck → CreateTdmRoleDigm → RD PDF → fileReName → copyFile).
     * 생성기가 없는 동안에는 {@link RoleDigmPdfMaker}가 먼저 거절해 기존 첨부를 지우지 않는다.
     */
    @Transactional
    public void recreate(UserPrincipal user, Long roleDigmId) {
        Long companyId = requireScope(user, roleDigmId);
        pdfMaker.make(roleDigmId, companyId);
    }

    /**
     * AS-IS Tdm33_RoleDigmFile.fileCheck → tdm.Tdm32_RoleDigm.selectByRegDate (N13) — 로그인 회사만.
     * 조회할 때마다 먼저 첨부가 없는 파일정보 행을 지운다(AS-IS retrieve()의 순서)
     */
    @Transactional
    public List<RoleDigmCompanyRes> searchCompany(UserPrincipal user, String startDate, String closeDate, boolean notEndYn, boolean notPeriodYn) {
        RoleDigmCompanyParam param = new RoleDigmCompanyParam(user.getCompanyId(), startDate, closeDate, notEndYn, notPeriodYn);
        mapper.deleteFileInfoWithoutFile(param);
        return mapper.selectByRegDate(param);
    }

    /** AS-IS Tdm32_RoleDigm.update(UpdateDataModel): roleDigmId가 없거나 ≤ 0이면 INSERT, 아니면 UPDATE */
    @Transactional
    public void save(UserPrincipal user, List<RoleDigmSaveReq> rows) {
        for (RoleDigmSaveReq row : rows) {
            if (row.roleDigmId() == null || row.roleDigmId() <= 0) {
                mapper.insertRoleDigm(mapper.selectNextId(), user.getCompanyId(), row.regDate(), row.allcStdDate(), row.reasonCode(), user.getName());
            } else {
                requireOwn(user, row.roleDigmId());
                mapper.updateRoleDigm(row.roleDigmId(), user.getCompanyId(), row.regDate(), row.allcStdDate(), row.reasonCode(), user.getName());
            }
        }
    }

    /** AS-IS Tdm32_RoleDigm.delete (UpdateDataModel.deleteModel) — 파일정보·첨부는 AS-IS도 남기고, 다음 조회의 fileCheck가 첨부 없는 파일정보만 지운다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> roleDigmIds) {
        if (roleDigmIds == null || roleDigmIds.isEmpty()) {
            return 0;
        }
        for (Long id : roleDigmIds) {
            requireOwn(user, id);
        }
        return mapper.deleteRoleDigms(user.getCompanyId(), roleDigmIds);
    }

    /** AS-IS tdm.Tdm33_RoleDigmFile.insertByRoleDigmId → 새 파일정보 ID (그 ID를 parentId로 첨부를 올린다) */
    @Transactional
    public Long createFileInfo(UserPrincipal user, Long roleDigmId, String fileType) {
        requireOwn(user, roleDigmId);
        Long roleDigmFileId = mapper.selectNextId();
        mapper.insertFileInfo(roleDigmFileId, roleDigmId, fileType);
        return roleDigmFileId;
    }

    /** AS-IS tdm.Tdm33_RoleDigmFile.deleteByRoleDigmId: 첨부(실제 파일 + sys10_file 행)를 지우고 파일정보 행을 지운다 */
    @Transactional
    public void deleteFileInfo(UserPrincipal user, Long roleDigmId, String fileType) {
        requireOwn(user, roleDigmId);
        for (Long fileId : mapper.selectAttachIdByFileType(roleDigmId, fileType)) {
            sysFileService.delete(fileId);
        }
        mapper.deleteFileInfo(roleDigmId, fileType);
    }

    /** 책무체계도가 로그인 회사 것이어야 한다 */
    private void requireOwn(UserPrincipal user, Long roleDigmId) {
        Long companyId = mapper.selectCompanyId(roleDigmId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private Long requireScope(UserPrincipal user, Long roleDigmId) {
        Long companyId = mapper.selectCompanyId(roleDigmId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.isSysAdmin() && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }
}
