package kr.co.kfs.asseterp.biz.icam.service;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileDelRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprActionMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserSaveReq;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamUserMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** ICAM 사용자ID 신청서 작성 (AS-IS Icam55_Tab_UserRegAppr → server/icam/Icam55_IcamUser, EE29) */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamUserService {

    /** 결재 진행·완료 (10 결재중 · 20 · 30 완료) — 화면이 막는 상태 */
    private static final Set<String> LOCKED = Set.of("10", "20", "30");
    private static final String REG_TYPE_USER = "1";
    private static final String LOCKED_MSG = "결재 중인 문서이거나, 완료된 문서가 포함되어있습니다";

    private final IcamUserMapper mapper;
    private final AprApprActionMapper actionMapper;
    private final AprApprWriteMapper writeMapper;

    /** AS-IS icam.Icam55_IcamUser.selectBySearchText — 검색어는 클라이언트가 `%검색어%`(없으면 `%`)로 만들어 보냈다 */
    public List<IcamUserRes> search(String searchText, LocalDate startDate, LocalDate closeDate, boolean procResult) {
        String like = (searchText == null || searchText.isBlank()) ? "%" : "%" + searchText + "%";
        return mapper.selectBySearchText(like, startDate, closeDate, procResult, REG_TYPE_USER);
    }

    /**
     * AS-IS icam.Icam55_IcamUser.update(UpdateDataModel) — icamUserId가 없거나 0 이하면 INSERT, 아니면 UPDATE.
     * 검사는 Icam55_Edit_UserRegAppr.updateRow L209-277 의 순서·문구 그대로(화면 검사를 서버도 한다).
     */
    @Transactional
    public IcamUserRes save(UserPrincipal user, IcamUserSaveReq req) {
        boolean isNew = req.icamUserId() == null || req.icamUserId() <= 0;
        if (!isNew) {
            IcamUserRes old = mapper.selectById(req.icamUserId());
            if (old == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "신청서를 찾을 수 없습니다");
            }
            if (old.apprStatusCode() != null && LOCKED.contains(old.apprStatusCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, LOCKED_MSG);
            }
        }
        if (req.regDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "신청일자를 입력해주세요");
        }
        if (isBlank(req.companyName())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회사명을 입력해주세요");
        }
        if (isBlank(req.userName())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용자를 입력해주세요");
        }
        if (!Boolean.TRUE.equals(req.procAddYn()) && !Boolean.TRUE.equals(req.procModiYn()) && !Boolean.TRUE.equals(req.procdelYn())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "처리구분을 선택해주세요");
        }
        if (isBlank(req.regContent())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "신청내용을 입력해주세요");
        }
        long id;
        if (isNew) {
            id = mapper.selectNextId();
            mapper.insertIcamUser(id, user.getUserId(), req);
        } else {
            id = req.icamUserId();
            mapper.updateIcamUser(req);
        }
        return mapper.selectById(id);
    }

    /** AS-IS Icam55_Tab_UserRegAppr.updateApprId → icam.Icam55_IcamUser.updateApprId */
    @Transactional
    public void updateApprId(Long icamUserId, Long apprId) {
        if (apprId == null || mapper.selectById(icamUserId) == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        mapper.updateApprId(apprId, icamUserId);
    }

    /**
     * AS-IS Icam55_Tab_UserRegAppr.aprDelete → apr.Apr01_Appr.deleteByApprId (server/apr/Apr01_Appr.java L1017-1070).
     * 임시저장(99)은 완전 삭제(연관펀드·첨부 파일·결재선), 그 밖은 폐기문서(apr99)로 옮긴 뒤 상신문서를 지운다.
     * 운용보고서·기획펀드의 상신ID 초기화와 광고대장 삭제는 두 경우 모두 한다.
     */
    @Transactional
    public void deleteAppr(UserPrincipal user, Long apprId) {
        AprApprBrief doc = writeMapper.selectBrief(apprId, user.getCompanyId());
        if (doc == null) {
            return;
        }
        if ("99".equals(doc.statusCode())) {
            writeMapper.deleteRelateFundsByApprId(apprId);
            for (AprFileDelRow f : writeMapper.selectFilesForDelete(apprId)) {
                File file = new File(f.serverPath(), String.valueOf(f.fileId()));
                log.info("임시저장 문서 첨부 삭제 fileId={} {}", f.fileId(), file.delete() ? "성공" : "실패");
            }
            writeMapper.deleteFilesByParentId(apprId);
            writeMapper.deleteStepsByApprId(apprId);
        } else {
            actionMapper.insertApprDel(apprId, user.getUserId());
        }
        actionMapper.deleteAppr(apprId);
        actionMapper.clearOprApprId(apprId);
        actionMapper.clearPlanApprId(apprId);
        actionMapper.deleteAdvertByApprId(apprId);
    }

    /**
     * AS-IS Icam55_Tab_UserRegAppr.deleteCheck(결재 중이면 막음) → delete(): icam.Icam55_IcamUser.deleteApprId(상신문서를 폐기문서로 옮기고 삭제)
     * → icam.Icam55_IcamUser.delete(행 삭제). 상신문서 삭제는 이 서비스에서만 쓰는 `insertApprDel`·`deleteAppr` 두 문장이다.
     */
    @Transactional
    public void delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "삭제할 정보를 먼저 선택해주세요");
        }
        List<IcamUserRes> rows = ids.stream().map(mapper::selectById).toList();
        for (IcamUserRes row : rows) {
            if (row == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "신청서를 찾을 수 없습니다");
            }
            if ("10".equals(row.apprStatusCode()) || "20".equals(row.apprStatusCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "결재진행 중인 문서가 존재합니다");
            }
        }
        for (IcamUserRes row : rows) {
            if (row.apprId() != null) {
                actionMapper.insertApprDel(row.apprId(), user.getUserId());
                actionMapper.deleteAppr(row.apprId());
            }
            mapper.deleteIcamUser(row.icamUserId());
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }
}
