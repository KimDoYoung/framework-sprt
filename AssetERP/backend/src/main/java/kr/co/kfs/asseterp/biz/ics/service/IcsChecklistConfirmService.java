package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprIdReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateApprRow;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistConfirmMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import kr.co.kfs.asseterp.common.util.Texts;

/**
 * AS-IS Ics15_Tab_ChecklistConfirm → server/ics/Ics11_ChecklistCompany.selectChecklistStatusPaging L40 + Ics15_ChecklistWrite.updateConfirmYn L79
 * + Ics16_RelateAppr.selectByConfirmerId L45 — K06 내부통제내역 확인(부서장). stdDate = 기준 분기(월)의 말일. 확인자는 로그인 사용자
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsChecklistConfirmService {

    private final IcsChecklistConfirmMapper mapper;

    /** AS-IS selectChecklistStatusPaging: 목록 + 전체 건수. 검색어는 AS-IS처럼 앞뒤에 %를 붙인다. 제출구분·확인구분(원본 2026-11-02 CH-0041·0178)은 'true'·'false'·null(전체) */
    public PageRes<IcsChecklistConfirmRes> search(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistLClassId, Long checklistMClassId,
                                                  String searchText, String fixYn, String confirmYn, int offset, int limit) {
        String like = Texts.like(searchText);
        String fix = Texts.trueFalseOrNull(fixYn);
        String conf = Texts.trueFalseOrNull(confirmYn);
        return new PageRes<>(mapper.selectTotal(user.getCompanyId(), user.getUserId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, fix, conf),
                mapper.selectPaging(user.getCompanyId(), user.getUserId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, fix, conf, offset, limit));
    }

    /**
     * 출력/다운로드 — AS-IS는 Sys99_Print.insertRdChecklistConfirm(sys99_print에 쌓음) + RD 리포트 Ics15_Rd_ChecklistConfirm.
     * RD 서버가 없으므로 RD에 싣던 값(대분류·중분류·체크결과·담당부서·담당자·확인여부)을 한 시트에 쓴다. 전체 건수만큼 한 번에 읽는다(AS-IS와 같다)
     */
    public byte[] download(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistLClassId, Long checklistMClassId,
                           String searchText, String fixYn, String confirmYn) {
        String like = Texts.like(searchText);
        String fix = Texts.trueFalseOrNull(fixYn);
        String conf = Texts.trueFalseOrNull(confirmYn);
        long total = mapper.selectTotal(user.getCompanyId(), user.getUserId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, fix, conf);
        List<List<Object>> rows = total == 0 ? List.of() : mapper.selectPaging(user.getCompanyId(), user.getUserId(), stdDate, cycleType,
                        checklistLClassId, checklistMClassId, like, fix, conf, 0, total).stream()
                .map(r -> row(r.checkLClassName(), r.checkMClassName(), r.reason(), r.orgName(), r.personName(), Boolean.TRUE.equals(r.confirmYn()) ? "확인" : ""))
                .toList();
        return IcsExcelWriter.write("내부통제내역 확인", List.of("대분류", "중분류", "체크결과", "담당부서", "담당자", "확인여부"), rows);
    }

    /**
     * AS-IS updateConfirmYn: 고른 행을 확인('true')·확인취소('false'). 그 달 작성 행이 있으면 확인 열만 바꾸고, 없으면 확인만 채운 행을 만든다.
     * 확인자는 확인이면 로그인 사용자, 취소면 비운다(작성 행이 없을 때 만드는 행은 원본이 취소여도 확인자를 넣는다)
     */
    @Transactional
    public int updateConfirmYn(UserPrincipal user, IcsChecklistConfirmReq req) {
        boolean confirm = Boolean.TRUE.equals(req.confirmYn());
        String confirmYn = confirm ? "true" : "false";
        int count = 0;
        for (IcsChecklistConfirmReq.Target t : req.rows() == null ? List.<IcsChecklistConfirmReq.Target>of() : req.rows()) {
            Long writeId = mapper.selectWriteId(user.getCompanyId(), t.checklistId(), t.personId(), req.yyyymm(), req.cycleType());
            if (writeId != null) {
                count += mapper.updateConfirm(user.getCompanyId(), writeId, confirm ? user.getUserId() : null, confirmYn);
            } else {
                count += mapper.insertConfirm(user.getCompanyId(), mapper.selectNextId(), t.checklistId(), req.yyyymm(), t.personId(), user.getUserId(), confirmYn, req.cycleType());
            }
        }
        return count;
    }

    /** AS-IS ics.Ics16_RelateAppr.selectByConfirmerId: 대분류별 전체·확인 건수와 결재 상태 */
    public List<IcsChecklistRelateApprRes> relateApprs(UserPrincipal user, LocalDate stdDate, String cycleType) {
        return mapper.selectRelateApprs(user.getCompanyId(), user.getUserId(), stdDate, cycleType);
    }

    /**
     * AS-IS ics.Ics16_RelateAppr.updateApprId L63-116 (A27 상신 뒤) — 이전 상신 문서(lastApprId)가 있으면 폐기 보관 후 지우고,
     * 그 달·대분류의 연결 행이 없으면 만들고 있으면 상신 문서 ID를 바꾼다.
     * 폐기할 문서는 이 연결 행에 기록된 문서만 받는다(원본은 클라이언트가 준 번호를 그대로 지운다).
     */
    @Transactional
    public void updateRelateApprId(UserPrincipal user, IcsChecklistRelateApprIdReq req) {
        if (req.stdDate() == null || req.cycleType() == null || req.checklistLClassId() == null || req.apprId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신 정보가 올바르지 않습니다.");
        }
        Long companyId = user.getCompanyId();
        if (mapper.countAppr(companyId, req.apprId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신 문서를 찾을 수 없습니다.");
        }
        String yyyymm = req.stdDate().format(java.time.format.DateTimeFormatter.ofPattern("yyyy.MM"));
        IcsRelateApprRow row = mapper.selectRelateAppr(companyId, yyyymm, req.cycleType(), req.checklistLClassId());
        if (req.lastApprId() != null) {
            if (row == null || !req.lastApprId().equals(row.apprId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "폐기할 이전 상신 문서가 이 체크리스트의 문서가 아닙니다.");
            }
            mapper.insertApprDel(companyId, req.lastApprId(), user.getUserId());  // (4) apr99_appr_del insert
            mapper.deleteAppr(companyId, req.lastApprId());                       // (5) apr01_appr delete
        }
        if (row == null) {
            mapper.insertRelateAppr(mapper.selectNextId(), companyId, yyyymm, req.cycleType(), req.apprId(), user.getUserId(), req.checklistLClassId());
        } else {
            mapper.updateRelateApprId(companyId, yyyymm, req.cycleType(), req.checklistLClassId(), req.apprId());
        }
    }

    private static List<Object> row(Object... values) {
        return Arrays.asList(values);
    }
}
