package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistConfirmMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * AS-IS Ics15_Tab_ChecklistConfirm → server/ics/Ics11_ChecklistCompany.selectChecklistStatusPaging L40 + Ics15_ChecklistWrite.updateConfirmYn L79
 * + Ics16_RelateAppr.selectByConfirmerId L45 — K06 내부통제내역 확인(부서장). stdDate = 기준 분기(월)의 말일. 확인자는 로그인 사용자
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsChecklistConfirmService {

    private final IcsChecklistConfirmMapper mapper;

    /** AS-IS selectChecklistStatusPaging: 목록 + 전체 건수. 검색어는 AS-IS처럼 앞뒤에 %를 붙인다 */
    public PageRes<IcsChecklistConfirmRes> search(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistLClassId, Long checklistMClassId,
                                                  String searchText, boolean unCheckYn, boolean unConfirmYn, int offset, int limit) {
        String like = like(searchText);
        return new PageRes<>(mapper.selectTotal(user.getCompanyId(), user.getUserId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn),
                mapper.selectPaging(user.getCompanyId(), user.getUserId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn, offset, limit));
    }

    /**
     * 출력/다운로드 — AS-IS는 Sys99_Print.insertRdChecklistConfirm(sys99_print에 쌓음) + RD 리포트 Ics15_Rd_ChecklistConfirm.
     * RD 서버가 없으므로 RD에 싣던 값(대분류·중분류·체크결과·담당부서·담당자·확인여부)을 한 시트에 쓴다. 전체 건수만큼 한 번에 읽는다(AS-IS와 같다)
     */
    public byte[] download(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistLClassId, Long checklistMClassId,
                           String searchText, boolean unCheckYn, boolean unConfirmYn) {
        String like = like(searchText);
        long total = mapper.selectTotal(user.getCompanyId(), user.getUserId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn);
        List<List<Object>> rows = total == 0 ? List.of() : mapper.selectPaging(user.getCompanyId(), user.getUserId(), stdDate, cycleType,
                        checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn, 0, total).stream()
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

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }

    private static List<Object> row(Object... values) {
        return Arrays.asList(values);
    }
}
