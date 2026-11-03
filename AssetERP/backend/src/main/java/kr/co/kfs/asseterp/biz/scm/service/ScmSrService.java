package kr.co.kfs.asseterp.biz.scm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.SrDevMngSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrRes;
import kr.co.kfs.asseterp.biz.scm.dto.SrSaveReq;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmSrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * AS-IS Scm01_Tab_Sr·Scm01_Edit_Sr·Scm01_Edit_SrRO·Scm01_Lookup_SrContent(EE15) → server/scm/Scm01_Sr.java
 * (selectById L21 / selectByText L26 / update L77 / updateContent L96 / delete L118)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScmSrService {

    private final ScmSrMapper mapper;

    /** AS-IS selectByText — searchText 가 비었으면("%%") 검색어 조건을 뺀다 */
    public List<SrRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText, String systemCode,
                              String srStatus, boolean checkBox01, boolean checkBox02, boolean checkBoxMyReg) {
        String text = searchText == null || searchText.isBlank() ? null : "%" + searchText + "%";
        return mapper.selectByText(startDate, closeDate, text, systemCode == null ? "%" : systemCode, srStatus == null ? "%" : srStatus,
                checkBox01, checkBox02, checkBoxMyReg, user.getUserId());
    }

    /** AS-IS scm01_sr.getSrModel (EE17) — 개발ID로 의뢰 한 건 */
    public SrRes getByDevId(Long devId) {
        SrRes row = mapper.selectByDevId(devId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS selectById */
    public SrRes get(Long srId) {
        SrRes row = mapper.selectById(srId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS dbConfig.getSeq — [등록]의 새 의뢰(첨부파일을 올리려면 번호가 먼저 있어야 한다). f_create_seq()가 시퀀스를 갱신하므로 쓰기 트랜잭션 */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS update — 의뢰번호(srNo)가 없으면 만든다: 그날 마지막 번호 + 1, 그날 첫 건이면 yyMMdd-001.
     * 새 의뢰(DB에 없음)면 INSERT(등록자 = 로그인 사원), 있으면 폼이 바꾸는 열만 UPDATE. 저장 결과 한 행을 돌려준다
     */
    @Transactional
    public SrRes save(UserPrincipal user, SrSaveReq req) {
        if (req.srId() == null || req.srDate() == null || req.systemCd() == null)
            throw new BusinessException(ErrorCode.INVALID_INPUT, "필수 항목이 비어 있습니다");
        SrRes old = mapper.selectById(req.srId());
        String srNo = old == null ? null : old.srNo();
        if (srNo == null) {
            srNo = mapper.createSrNo(req.srDate());
            if (srNo == null) srNo = req.srDate().format(DateTimeFormatter.ofPattern("yyMMdd")) + "-001";
        }
        if (old == null) mapper.insertSr(user.getUserId(), srNo, req);
        else mapper.updateSr(srNo, req);
        return mapper.selectById(req.srId());
    }

    /** AS-IS updateContent */
    @Transactional
    public void updateContent(Long srId, String srContent) {
        mapper.updateContent(srId, srContent);
    }

    /** AS-IS delete */
    @Transactional
    public int delete(List<Long> srIds) {
        if (srIds == null || srIds.isEmpty()) return 0;
        return mapper.deleteSrs(srIds);
    }

    /** AS-IS selectByDevMng (EE16) — 승인 완료 의뢰. searchText 가 비었으면 검색어 조건을 뺀다 */
    public List<SrRes> searchDevMng(LocalDate startDate, LocalDate closeDate, String searchText, String systemCode, String srStatus, boolean checkBox01) {
        String text = searchText == null || searchText.isBlank() ? null : "%" + searchText + "%";
        return mapper.selectByDevMng(startDate, closeDate, text, systemCode == null ? "%" : systemCode, srStatus == null ? "%" : srStatus, checkBox01);
    }

    /** Scm01_Edit_DevMng.updateRow (EE16) — 화면이 바꾸는 열만 UPDATE, 저장된 한 행을 돌려준다 */
    @Transactional
    public SrRes saveDevMng(Long srId, SrDevMngSaveReq req) {
        if (mapper.updateDevMng(srId, req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return mapper.selectById(srId);
    }

    /** AS-IS updateResultContent (EE16) */
    @Transactional
    public void updateResultContent(Long srId, String resultContent) {
        mapper.updateResultContent(srId, resultContent);
    }
}
