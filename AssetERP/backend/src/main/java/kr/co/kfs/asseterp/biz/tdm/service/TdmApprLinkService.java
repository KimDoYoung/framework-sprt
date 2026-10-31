package kr.co.kfs.asseterp.biz.tdm.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmApprLinkMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckJobMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleDigmMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * 책무 결재 상신 뒤 처리 (V34) — 결재문서 번호 기록과, AS-IS가 결재문서를 저장할 때 하던 첨부 자동등록 `copyFileLine`(Sys10_File.copyFile).
 * TOBE는 문서 ID가 정해지는 이 때 첨부를 문서에 연결한다(이미 연결된 파일은 다시 넣지 않는다).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmApprLinkService {

    private final TdmApprLinkMapper mapper;
    private final TdmCheckJobMapper checkJobMapper;
    private final TdmRoleDigmMapper roleDigmMapper;

    /** A90 AS-IS tdm.Tdm34_RoleAllcDetail.updateApprId */
    @Transactional
    public void updateRoleAllcDetailApprId(UserPrincipal user, Long roleAllcDetailId, Long apprId) {
        requireOne(mapper.updateRoleAllcDetailApprId(roleAllcDetailId, user.getCompanyId(), apprId));
    }

    /** A91 AS-IS tdm.Tdm31_RoleDesc.updateApprId + copyFileLine(roleDescId) */
    @Transactional
    public void updateRoleDescApprId(UserPrincipal user, Long roleDescId, Long apprId) {
        requireOne(mapper.updateRoleDescApprId(roleDescId, user.getCompanyId(), apprId));
        copyFiles(roleDescId, apprId);
    }

    /** AS-IS tdm.Tdm31_RoleDesc.updateWorkDate — on: 99(작업중 시각 기록), off: 10(비움) */
    @Transactional
    public void updateRoleDescWorkDate(UserPrincipal user, Long roleDescId, boolean on) {
        requireOne(mapper.updateRoleDescWorkDate(roleDescId, user.getCompanyId(), on));
    }

    /**
     * A92 결재요청 아이콘의 앞부분 (Tdm32_Tab_RoleDigm actionCell03 L287-324): 사용자가 올린 파일(fileType "2")이 정확히 한 건이면 그 파일을 쓰고(useFileType "2"),
     * 아니면 시스템 생성 파일 정보(fileType "1")를 두고(useFileType "1") `tdm.Tdm32_RoleDigm.updateUseFileType`으로 기록한다. 정한 구분을 돌려준다.
     * AS-IS upsertByRoleDigmId는 시스템 생성 파일 정보를 만들면서 예전 생성 첨부도 지워 다시 만들지만, TOBE는 RD로 파일을 만들 수 없어 예전 첨부는 지우지 않는다.
     */
    @Transactional
    public String readyRoleDigmAppr(UserPrincipal user, Long roleDigmId) {
        if (roleDigmMapper.selectCompanyId(roleDigmId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        String useFileType;
        if (roleDigmMapper.selectFileIdByFileType(roleDigmId, "2").size() == 1) {
            useFileType = "2";
        } else {
            useFileType = "1";
            if (roleDigmMapper.selectFileIdByFileType(roleDigmId, "1").isEmpty()) {
                roleDigmMapper.insertFileInfo(roleDigmMapper.selectNextId(), roleDigmId, "1");
            }
        }
        requireOne(mapper.updateRoleDigmUseFileType(roleDigmId, user.getCompanyId(), useFileType));
        return useFileType;
    }

    /** A92 AS-IS tdm.Tdm32_RoleDigm.updateApprId + copyFileLine(roleDigmFileId) */
    @Transactional
    public void updateRoleDigmApprId(UserPrincipal user, Long roleDigmId, Long apprId) {
        requireOne(mapper.updateRoleDigmApprId(roleDigmId, user.getCompanyId(), apprId));
        Long fileInfoId = mapper.selectRoleDigmFileId(roleDigmId);
        if (fileInfoId != null) {
            copyFiles(fileInfoId, apprId);
        }
    }

    /**
     * A94 AS-IS Tdm50_TabPage_CheckJob.insertApprId(tdm.Tdm56_ChckRelateAppr.insertApprId) + 문서 저장 때의 copyFileLine —
     * 탭(보고CEO 직책)의 임원 승인현황 그리드 행마다 그 이행점검보고서 첨부를 문서에 연결한다.
     */
    @Transactional
    public void insertCheckRelateAppr(UserPrincipal user, Long chckJobId, Long roleId, Long apprId) {
        if (mapper.selectChckJob(chckJobId, user.getCompanyId()) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        mapper.insertChckRelateAppr(chckJobId, apprId, roleId);
        List<CheckExctRes> excts = checkJobMapper.selectExcts(chckJobId, roleId);
        for (CheckExctRes e : excts) {
            copyFiles(e.chckExctId(), apprId);
        }
    }

    private void copyFiles(Long parentId, Long apprId) {
        for (Long fileId : mapper.selectFileIds(parentId)) {
            if (mapper.countApprRelateFile(fileId, apprId) == 0) {
                mapper.insertApprRelateFile(mapper.selectNextId(), fileId, apprId);
            }
        }
    }

    private static void requireOne(int n) {
        if (n == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
