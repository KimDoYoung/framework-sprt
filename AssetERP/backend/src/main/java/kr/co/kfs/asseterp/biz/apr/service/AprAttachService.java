package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocFormRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprEditFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileDelRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileOptionsReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDoc2Cond;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDoc2Row;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprAttachMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 상신 편집창의 [불러오기]·[양식]과 첨부파일 옵션설정·추가/삭제 (AS-IS client/vi/apr/Apr05_Lookup_LoadDoc2 · dcr/Dcr05_Lookup_FormView · apr/Apr01_Lookup_ApprFileList · sys/Sys61_Lookup_FileList·DelList, V05) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprAttachService {

    private final AprAttachMapper mapper;
    private final AprApprWriteMapper writeMapper;
    private final AprApprNewMapper newMapper;
    private final AprApprDetailService detailService;

    /** AS-IS dcr.Dcr00_DocList.selectByText — 내가 볼 수 있는 문서만(admin == 'false' 가지) */
    public List<AprLoadDoc2Row> loadDocs(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText) {
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조회기간 시작일을 선택하세요");
        }
        if (endDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조회기간 종료일을 선택하세요");
        }
        Long orgId = newMapper.selectOrgCodeId(user.getUserId());
        return mapper.selectLoadDocs(new AprLoadDoc2Cond(user.getCompanyId(), orgId, user.getUserId(), classTreeId, startDate, endDate,
                "%" + (searchText == null ? "" : searchText) + "%"));
    }

    /** AS-IS dcr.Dcr05_DocType.selectByClassTreeId(그 문서분류에 연결된 양식) / selectByName(전체보기) */
    public List<AprDocFormRow> docForms(UserPrincipal user, Long classTreeId, boolean all, String searchText, String formClassCode) {
        String title = searchText == null ? "%" : "%" + searchText + "%";
        String formClass = formClassCode == null || formClassCode.isEmpty() ? "%" : formClassCode;
        return all
                ? mapper.selectDocFormsByName(user.getCompanyId(), title, formClass)
                : mapper.selectDocFormsByClassTree(user.getCompanyId(), classTreeId, title, formClass);
    }

    /** AS-IS sys.Sys10_File.selectByParentId — 상신 중인 새 문서(아직 문서 행이 없음)는 누구나, 있는 문서는 볼 수 있는 사원만 */
    public List<AprEditFileRes> getEditFiles(UserPrincipal user, Long apprId) {
        access(user, apprId);
        return mapper.selectEditFiles(apprId);
    }

    /** AS-IS sys.Sys10_File.updateOthers — 줄마다 출력·확장자 표시와 순서. 새 문서·임시저장(99)·반려(40)·관리자만 */
    @Transactional
    public void saveOptions(UserPrincipal user, Long apprId, AprFileOptionsReq req) {
        requireEditableStatus(user, apprId, false);
        if (req.items() == null) {
            return;
        }
        for (AprFileOptionsReq.Item i : req.items()) {
            mapper.updateFileOthers(i.fileId(), apprId, String.valueOf(i.printYn()), String.valueOf(i.extYn()), i.seq());
        }
    }

    /** AS-IS sys.Sys61_FileDel.selectByParentId */
    public List<AprFileDelRes> getFileDels(UserPrincipal user, Long apprId) {
        access(user, apprId);
        return mapper.selectFileDels(apprId);
    }

    /**
     * AS-IS sys.Sys61_FileDel.insert L34-57: 고른 파일마다 삭제 내역(사유·삭제자)을 남기고 파일의 부모를 그 내역 ID로 옮긴다 — 파일은 지우지 않고 문서에서만 떼어 둔다.
     * 반려(40) 문서에서만(창이 반려 문서에 열린다), 파일이 이 문서의 것인지 서버가 확인한다
     */
    @Transactional
    public void deleteFiles(UserPrincipal user, Long apprId, List<Long> fileIds, String reason) {
        requireEditableStatus(user, apprId, true);
        if (fileIds == null || fileIds.isEmpty()) {
            return;
        }
        if (mapper.countFilesIn(apprId, fileIds) != fileIds.size()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        for (Long fileId : fileIds) {
            Long fileDelId = mapper.selectNextId();
            mapper.insertFileDel(fileDelId, fileId, apprId, reason, user.getUserId());
            mapper.moveFileParent(fileId, fileDelId, "[삭제 empId:" + user.getUserId() + "]");
        }
    }

    private void access(UserPrincipal user, Long apprId) {
        if (writeMapper.selectBrief(apprId, user.getCompanyId()) != null) {
            detailService.getDetail(user, apprId);
        }
    }

    /** 새 문서(문서 행 없음)·관리자는 늘, 그 밖에는 반려(40)·임시저장(99)(onlyRejected면 반려만) */
    private void requireEditableStatus(UserPrincipal user, Long apprId, boolean onlyRejected) {
        AprApprBrief doc = writeMapper.selectBrief(apprId, user.getCompanyId());
        if (doc == null) {
            if (onlyRejected) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            return;
        }
        detailService.getDetail(user, apprId);
        if (SysMenuSearchService.isManager(user)) {
            return;
        }
        boolean ok = onlyRejected ? "40".equals(doc.statusCode()) : ("40".equals(doc.statusCode()) || "99".equals(doc.statusCode()));
        if (!ok) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
