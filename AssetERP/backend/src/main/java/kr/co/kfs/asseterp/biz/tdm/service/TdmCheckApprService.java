package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprCmntReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprBatchReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprEndInfoRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprKey;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprManlRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprNeighborRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStartReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStatusReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprSubmitReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRecordParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckApprRecordRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckApprMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckOrgMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckRecordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * 책무이행점검 승인 — AS-IS Tdm59_Tab_CheckAppr(N23) → server/tdm/Tdm59_ChckApprCmnt·Tdm60_ChckManlAppr·Tdm61_ChckInsuffAppr.
 * AS-IS는 화면이 승인 모델(최초·최종 승인자 여부, 상태 코드 …)을 통째로 보냈다. TOBE는 승인 행 ID만 받고 서버가 로그인 사용자의 승인 행을
 * 같은 SQL로 다시 읽어 상태 판단에 쓴다 — 로그인 사용자의 승인 행이 아니면 거부한다(정상 화면 흐름의 값은 같다).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmCheckApprService {

    private static final Pattern CHECK_YM = Pattern.compile("\\d{4}\\.\\d{2}");

    private final TdmCheckApprMapper mapper;
    private final TdmCheckOrgMapper orgMapper;
    private final TdmChckRecordMapper recordMapper;
    private final TdmCheckManlService manlService;

    // ================= 본 화면 =================

    /** AS-IS tdm.Tdm50_ChckJob.selectEndInfoByApprEmpId — 점검 작업이 없으면 null */
    public CheckApprEndInfoRes searchEndInfo(UserPrincipal user, String checkYm) {
        firstDay(checkYm);
        return mapper.selectEndInfo(user.getCompanyId(), checkYm);
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.selectByApprEmpId — 기준일은 점검년월의 첫날 */
    public List<CheckApprListRes> search(UserPrincipal user, String checkYm, Long roleId) {
        return mapper.selectApprs(user.getCompanyId(), checkYm, roleId, user.getUserId(), firstDay(checkYm), null);
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.checkTdmSubmitPossibleYn — 가능하면 통과, 아니면 사유를 400으로 */
    public void checkSubmitPossible(UserPrincipal user, String checkYm, Long roleId, String actionType) {
        firstDay(checkYm);
        String type = requireOneOf(actionType, "P", "C");
        String value = mapper.selectSubmitPossible(user.getCompanyId(), checkYm, roleId, user.getUserId(), type);
        // 이 DB의 함수는 boolean('t'/'f'), AS-IS 소스는 'Y' 또는 불가 사유 문구를 기대한다 — 둘 다 받는다
        if ("Y".equals(value) || "t".equals(value) || "true".equals(value)) {
            return;
        }
        if (value == null || "f".equals(value) || "false".equals(value)) {
            throw fail("P".equals(type) ? "제출이 가능한 상태가 아닙니다" : "제출취소가 가능한 상태가 아닙니다");
        }
        throw fail(value);
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.updateSubmit — 대상은 로그인 사용자의 승인 행 전부 (AS-IS는 화면 그리드 전체) */
    @Transactional
    public void submit(UserPrincipal user, CheckApprSubmitReq req) {
        String actionType = requireOneOf(req.actionType(), "P", "C");
        LocalDate stdDate = firstDay(req.checkYm());
        checkSubmitPossible(user, req.checkYm(), req.roleId(), actionType);

        List<CheckApprListRes> rows = mapper.selectApprs(user.getCompanyId(), req.checkYm(), req.roleId(), user.getUserId(), stdDate, null);
        boolean submit = "P".equals(actionType);
        for (CheckApprListRes row : rows) {
            // 제출: 다음승인자 상태를 대기(10), 본인이 임원이면 임원승인여부 true / 제출취소: 반대로 null·false
            String parentApprStatusCode = submit ? "10" : null;
            if ("SELF".equals(row.cmntType())) {
                if (Boolean.TRUE.equals(row.finalApprEmpYn())) {
                    mapper.updateExctApprYn(row.chckExctId(), String.valueOf(submit), user.getName());
                } else {
                    // 다음승인자(SUB)의 승인상태
                    CheckApprNeighborRes parentSub = mapper.selectParent(row.chckExctId(), row.parentOrgId(), row.apprOrgId(), stdDate);
                    requireFound(parentSub);
                    mapper.updateApprStatus(parentSub.chckApprCmntId(), parentApprStatusCode);

                    // 다음승인자(SELF)의 승인상태
                    CheckApprNeighborRes parentSelf = mapper.selectChild(row.chckExctId(), row.parentOrgId(), stdDate);
                    requireFound(parentSelf);
                    if (submit) {
                        // 제출: 다음승인자의 self 상태가 null이면 '대기(10)'로
                        if (parentSelf.apprStatusCode() == null) {
                            mapper.updateApprStatus(parentSelf.chckApprCmntId(), "10");
                        }
                    } else if (mapper.countChild(parentSelf.chckExctId(), parentSelf.apprEmpId()) == 1) {
                        // 제출취소: 다음승인자의 sub부서가 나의부서밖에 없으면 null로
                        mapper.updateApprStatus(parentSelf.chckApprCmntId(), null);
                    }
                }
            }
            mapper.updateSubmit(row.chckApprCmntId(), String.valueOf(submit));
        }
    }

    /** AS-IS tdm.Tdm59_ChckApprCmnt.selectPreNextOrg — targetType pre(하위부서)·next(상위부서) */
    public CheckApprNeighborRes searchNeighbor(UserPrincipal user, Long chckApprCmntId, String targetType) {
        CheckApprListRes row = requireOwnAppr(user, chckApprCmntId);
        LocalDate stdDate = firstDay(row.checkYm());
        if ("pre".equals(targetType)) {
            return mapper.selectChild(row.chckExctId(), row.childOrgId(), stdDate);
        }
        if ("next".equals(targetType)) {
            return mapper.selectParent(row.chckExctId(), row.parentOrgId(), row.apprOrgId(), stdDate);
        }
        throw fail("정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요");
    }

    // ================= 종합의견 =================

    /** AS-IS tdm.Tdm52_ChckManl.countByChckApprCmntId(statusType 2) — 반려된 점검항목 수 (승인 의견 창이 [반려]/[등록]을 정한다) */
    public int countRejectedManls(UserPrincipal user, Long chckApprCmntId) {
        requireOwnAppr(user, chckApprCmntId);
        return mapper.countManlByAppr(chckApprCmntId, user.getUserId(), false, true);
    }

    /**
     * AS-IS tdm.Tdm59_ChckApprCmnt.updateApprCmnt — actionType A(승인/등록)·R(반려)·C(취소)·U(저장).
     * 응답은 처리 뒤 다시 읽은 승인 행. 의견이 null이면 읽은 값을 그대로 둔다 (AS-IS 에디터에 없는 칸은 모델 값이 남는다)
     */
    @Transactional
    public CheckApprListRes updateCmnt(UserPrincipal user, Long chckApprCmntId, CheckApprCmntReq req) {
        CheckApprListRes model = requireOwnAppr(user, chckApprCmntId);
        String actionType = requireOneOf(req.actionType(), "A", "R", "C", "U");
        LocalDate stdDate = firstDay(model.checkYm());
        String checkStartDate = orgMapper.selectCheckStartDate(model.chckJobId());
        String apprCmnt = req.apprCmnt() != null ? req.apprCmnt() : model.apprCmnt();
        String reportCmnt = req.reportCmnt() != null ? req.reportCmnt() : model.reportCmnt();
        boolean self = "SELF".equals(model.cmntType());
        boolean finalAppr = Boolean.TRUE.equals(model.finalApprEmpYn());

        String statusCode = model.apprStatusCode();
        String statusName = model.apprStatusName();
        String procType = null;

        switch (actionType) {
            case "A" -> {
                // 점검부서의 점검항목·조치내역 중 미승인(또는 반려)건이 있으면 거부
                if (mapper.countManlByAppr(chckApprCmntId, user.getUserId(), true, false) != 0) {
                    throw fail("미승인(또는 반려) 점검항목이 존재합니다");
                }
                if (mapper.countInsuffByAppr(chckApprCmntId, model.companyId(), model.roleId(), model.checkYm(), user.getUserId(), true, false) != 0) {
                    throw fail("미승인(또는 반려) 조치내역이 존재합니다");
                }
                if (self) {
                    // 'SELF'는 'SUB' 부서가 모두 승인(20)이어야 한다
                    if (!mapper.selectChildApprYn(model.chckExctId(), user.getUserId())) {
                        throw fail("승인하지 않은 하위부서가 존재합니다");
                    }
                    // 최종승인자(임원)는 모든 담당부서의 점검이 승인되었는지 확인
                    if (finalAppr) {
                        List<String> unCheckOrgs = mapper.selectUnCheckOrgNames(model.companyId(), model.checkYm(), model.roleId(), stdDate);
                        if (!unCheckOrgs.isEmpty()) {
                            String msg = "미점검 부서가 존재합니다 (" + unCheckOrgs.get(0);
                            msg += unCheckOrgs.size() == 1 ? ")" : " 외 " + (unCheckOrgs.size() - 1) + ")";
                            throw fail(msg);
                        }
                    }
                }
                statusCode = "20";
                statusName = "승인";
                procType = finalAppr ? "승인완료" : "승인진행";
            }
            case "R" -> {
                // 최초승인자는 반려 시 반려된 점검항목·조치내역이 있어야 한다
                if (Boolean.TRUE.equals(model.firstApprEmpYn())) {
                    int rejected = mapper.countManlByAppr(chckApprCmntId, user.getUserId(), false, true)
                            + mapper.countInsuffByAppr(chckApprCmntId, model.companyId(), model.roleId(), model.checkYm(), user.getUserId(), false, true);
                    if (rejected == 0) {
                        throw fail("반려된 점검항목 또는 조치내역이 존재하지 않습니다");
                    }
                }
                manlService.checkCmntLimit(model.companyId(), stdDate.toString(), apprCmnt);
                statusCode = "30";
                statusName = "반려";
                procType = "승인반려";
            }
            case "C" -> {
                // 상위부서의 승인이 끝났으면 취소 불가
                if (!self) {
                    CheckApprNeighborRes mine = mapper.selectChild(model.chckExctId(), model.apprOrgId(), stdDate);
                    requireFound(mine);
                    if (mine.apprStatusCode() == null || !"10".equals(mine.apprStatusCode())) {
                        throw fail("My부서의 승인(반려)이 완료되었습니다");
                    }
                }
                if ("20".equals(model.apprStatusCode())) {
                    actionType = "AC";
                    procType = "승인취소";
                } else if ("30".equals(model.apprStatusCode())) {
                    actionType = "RC";
                    procType = "반려취소";
                }
                statusCode = "10";
                statusName = "대기";
            }
            default -> { // U 저장: 상태는 그대로
            }
        }

        if (!self) {
            CheckApprNeighborRes child = mapper.selectChild(model.chckExctId(), model.childOrgId(), stdDate);
            if (child != null) {
                // 반려: 하위조직(SELF)의 제출여부를 false로
                if ("30".equals(statusCode)) {
                    mapper.updateSubmit(child.chckApprCmntId(), "false");
                } else if ("RC".equals(actionType)) {
                    // 반려취소: 하위조직(SELF)이 '승인'이 아니면 취소 불가, 맞으면 제출여부를 true로
                    if (!"20".equals(child.apprStatusCode())) {
                        throw fail(model.checkOrgName() + "의 승인상태가 변동되어 취소할 수 없습니다.");
                    }
                    mapper.updateSubmit(child.chckApprCmntId(), "true");
                }
            }
        }

        mapper.updateByApprInfo(chckApprCmntId, statusCode, apprCmnt, reportCmnt);

        // 점검이력 생성(tdm55)
        if (!"U".equals(actionType)) {
            record(model.companyId(), checkStartDate, chckApprCmntId, "TDM59", procType, user.getUserId(), statusName, apprCmnt, reportCmnt);
        }
        return requireOwnAppr(user, chckApprCmntId);
    }

    // ================= 아래 목록 =================

    /** AS-IS tdm.Tdm52_ChckManl.selectByChckApprCmntId — chckManlId를 주면 그 한 건, searchText는 글자가 있을 때 '%…%' */
    public List<CheckApprManlRes> searchManls(UserPrincipal user, Long chckApprCmntId, boolean undoneYn, String searchText, Long chckManlId) {
        requireOwnAppr(user, chckApprCmntId);
        String like = searchText == null ? null : "%" + searchText + "%";
        return mapper.selectManls(chckApprCmntId, user.getCompanyId(), user.getUserId(), chckManlId, undoneYn, like);
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByChckApprCmntId — chckInsuffId를 주면 그 한 건 */
    public List<CheckApprInsuffRes> searchInsuffs(UserPrincipal user, Long chckApprCmntId, boolean undoneYn, Long chckInsuffId) {
        CheckApprListRes model = requireOwnAppr(user, chckApprCmntId);
        return mapper.selectInsuffs(chckApprCmntId, user.getCompanyId(), firstDay(model.checkYm()), chckInsuffId, undoneYn);
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateApprStart — actionType P(승인시작: 점검상태 20→21, 조치상태 20→21)·C(시작취소: 21→20, 20→...) */
    @Transactional
    public void apprStart(UserPrincipal user, Long chckApprCmntId, CheckApprStartReq req) {
        CheckApprListRes model = requireOwnAppr(user, chckApprCmntId);
        String actionType = requireOneOf(req.actionType(), "P", "C");
        boolean start = "P".equals(actionType);
        List<CheckApprManlRes> manls = pick(mapper.selectManls(chckApprCmntId, user.getCompanyId(), user.getUserId(), null, false, null),
                req.chckManlIds(), CheckApprManlRes::chckManlId);
        List<CheckApprInsuffRes> insuffs = pick(mapper.selectInsuffs(chckApprCmntId, user.getCompanyId(), firstDay(model.checkYm()), null, false),
                req.chckInsuffIds(), CheckApprInsuffRes::chckInsuffId);

        // 점검항목
        for (CheckApprManlRes manl : manls) {
            orgMapper.updateCheckStatusById(manl.chckManlId(), start ? "21" : "20", user.getName());
            mapper.updateManlApprByManlId(manl.chckManlId(), "10", null);
            record(manl.companyId(), manl.checkDate(), manl.chckManlId(), "TDM52", start ? "승인시작" : "승인시작취소", user.getUserId(), null, null, null);
        }
        // 미흡/개선 조치내역
        for (CheckApprInsuffRes insuff : insuffs) {
            mapper.updateInsuffStatusCode(insuff.chckInsuffId(), start ? "21" : "20", user.getName());
            mapper.updateInsuffApprByInsuffId(insuff.chckInsuffId(), "10", null);
        }
    }

    /** AS-IS tdm.Tdm60_ChckManlAppr.updateApprStatus2 — actionType P(일괄승인)·C(일괄승인취소) */
    @Transactional
    public void batchAppr(UserPrincipal user, Long chckApprCmntId, CheckApprBatchReq req) {
        CheckApprListRes model = requireOwnAppr(user, chckApprCmntId);
        String actionType = requireOneOf(req.actionType(), "P", "C");
        boolean approve = "P".equals(actionType);
        String stdDate = orgMapper.selectCheckStartDate(model.chckJobId());
        String apprStatusCode = approve ? "20" : "10";
        String apprStatusName = approve ? "승인" : "대기";
        String procType = approve ? "승인진행" : "승인(반려)취소";

        List<CheckApprManlRes> manls = pick(mapper.selectManls(chckApprCmntId, user.getCompanyId(), user.getUserId(), null, false, null),
                req.chckManlIds(), CheckApprManlRes::chckManlId);
        for (CheckApprManlRes manl : manls) {
            // 승인: 의견은 읽은 값 그대로, 취소: 의견 비움
            mapper.updateManlApprById(manl.chckManlApprId(), apprStatusCode, approve ? manl.apprCmnt() : null);
            if (!approve) {
                orgMapper.updateCheckStatusById(manl.chckManlId(), "21", user.getName());  // 승인진행
            } else if (Boolean.TRUE.equals(manl.finalApprEmpYn())) {
                orgMapper.updateCheckStatusById(manl.chckManlId(), "25", user.getName());  // 최종승인자: 승인완료
                procType = "승인완료";
            }
            record(manl.companyId(), stdDate, manl.chckManlId(), "TDM52", procType, user.getUserId(), apprStatusName, manl.apprCmnt(), null);
        }
    }

    // ================= 점검항목 승인 창 =================

    /** AS-IS tdm.Tdm60_ChckManlAppr.updateApprStatus — actionType A(승인)·R(반려)·C(취소). 응답은 다시 읽은 점검항목 */
    @Transactional
    public CheckApprManlRes updateManlStatus(UserPrincipal user, Long chckApprCmntId, Long chckManlApprId, CheckApprStatusReq req) {
        requireOwnAppr(user, chckApprCmntId);
        CheckApprManlRes manl = requireManlAppr(user, chckApprCmntId, chckManlApprId);
        String actionType = requireOneOf(req.actionType(), "A", "R", "C");
        String stdDate = orgMapper.selectCheckStartDate(manl.chckJobId());

        String apprStatusCode;
        String apprStatusName;
        String checkStatusCode = manl.checkStatusCode();
        String procType;
        boolean finalAppr = Boolean.TRUE.equals(manl.finalApprEmpYn());
        switch (actionType) {
            case "A" -> {
                apprStatusCode = "20";
                apprStatusName = "승인";
                procType = "승인진행";
                if (finalAppr) {  // 최종승인자: 승인완료
                    checkStatusCode = "25";
                    procType = "승인완료";
                }
            }
            case "R" -> {
                apprStatusCode = "30";
                apprStatusName = "반려";
                checkStatusCode = "26";  // 승인반려
                procType = "승인반려";
            }
            default -> {
                apprStatusCode = "10";
                apprStatusName = "대기";
                checkStatusCode = "21";  // 승인진행
                procType = "승인(반려)취소";
            }
        }

        mapper.updateManlApprById(chckManlApprId, apprStatusCode, req.apprCmnt());
        // 승인(20)이 아니거나, 승인이면서 최종승인자면 점검상태를 바꾼다
        if (!"20".equals(apprStatusCode) || finalAppr) {
            orgMapper.updateCheckStatusById(manl.chckManlId(), checkStatusCode, user.getName());
        }
        record(manl.companyId(), stdDate, manl.chckManlId(), "TDM52", procType, user.getUserId(), apprStatusName, req.apprCmnt(), null);
        return requireManlAppr(user, chckApprCmntId, chckManlApprId);
    }

    /** AS-IS tdm.Tdm60_ChckManlAppr.updateApprCmnt — 승인(반려)의견 임시저장 (상태는 읽은 값 그대로) */
    @Transactional
    public void saveManlCmnt(UserPrincipal user, Long chckApprCmntId, Long chckManlApprId, String apprCmnt) {
        requireOwnAppr(user, chckApprCmntId);
        CheckApprManlRes manl = requireManlAppr(user, chckApprCmntId, chckManlApprId);
        mapper.updateManlApprById(chckManlApprId, manl.apprStatusCode(), apprCmnt);
    }

    // ================= 미흡/개선 조치결과 승인 창 =================

    /** AS-IS tdm.Tdm54_ChckInsuff.selectById — 승인 열이 없다(AS-IS 그대로). 다른 회사 것이면 거부 */
    public CheckApprInsuffRes getInsuff(UserPrincipal user, Long chckInsuffId) {
        CheckApprInsuffRes insuff = mapper.selectInsuffById(chckInsuffId);
        requireFound(insuff);
        requireCompany(user, insuff.companyId());
        return insuff;
    }

    /** AS-IS tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId */
    public List<CheckApprInsuffRecordRes> searchInsuffRecords(UserPrincipal user, Long chckInsuffId) {
        getInsuff(user, chckInsuffId);
        return mapper.selectInsuffRecords(chckInsuffId);
    }

    /** AS-IS tdm.Tdm61_ChckInsuffAppr.updateApprStatus — actionType A(승인)·R(반려)·C(취소). 응답은 다시 읽은 조치내역 */
    @Transactional
    public CheckApprInsuffRes updateInsuffStatus(UserPrincipal user, Long chckApprCmntId, Long chckInsuffApprId, CheckApprStatusReq req) {
        CheckApprListRes model = requireOwnAppr(user, chckApprCmntId);
        CheckApprInsuffRes insuff = requireInsuffAppr(user, model, chckInsuffApprId);
        String actionType = requireOneOf(req.actionType(), "A", "R", "C");
        LocalDate stdDate = firstDay(model.checkYm());
        boolean finalAppr = Boolean.TRUE.equals(insuff.finalApprEmpYn());

        String apprStatusCode;
        String apprStatusName;
        String statusCode;
        String procType;
        switch (actionType) {
            case "A" -> {
                apprStatusCode = "20";
                apprStatusName = "승인";
                statusCode = "21";  // 승인중
                procType = "승인진행";
                if (finalAppr) {    // 최종승인자(임원): 승인완료
                    statusCode = "25";
                    procType = "승인완료";
                }
            }
            case "R" -> {
                apprStatusCode = "30";
                apprStatusName = "반려";
                statusCode = "26";  // 승인반려
                procType = "승인반려";
            }
            default -> {
                apprStatusCode = "10";
                apprStatusName = "대기";
                statusCode = "21";  // 승인중
                procType = "승인(반려)취소";
            }
        }
        // 승인 또는 반려이면 의견 글자수 검사
        if (!"C".equals(actionType)) {
            manlService.checkCmntLimit(insuff.companyId(), stdDate.toString(), req.apprCmnt());
        }

        mapper.updateInsuffApprById(chckInsuffApprId, apprStatusCode, req.apprCmnt());
        mapper.updateInsuffStatusCode(insuff.chckInsuffId(), statusCode, user.getName());
        record(insuff.companyId(), stdDate.toString(), insuff.chckInsuffId(), "TDM54", procType, user.getUserId(), apprStatusName, req.apprCmnt(), null);
        return requireInsuffAppr(user, model, chckInsuffApprId);
    }

    /** AS-IS tdm.Tdm61_ChckInsuffAppr.updateApprCmnt — 승인(반려)의견 임시저장 (상태는 읽은 값 그대로) */
    @Transactional
    public void saveInsuffCmnt(UserPrincipal user, Long chckApprCmntId, Long chckInsuffApprId, String apprCmnt) {
        CheckApprListRes model = requireOwnAppr(user, chckApprCmntId);
        CheckApprInsuffRes insuff = requireInsuffAppr(user, model, chckInsuffApprId);
        mapper.updateInsuffApprById(chckInsuffApprId, insuff.apprStatusCode(), apprCmnt);
    }

    // ================= 승인이력 =================

    /** AS-IS tdm.Tdm55_ChckRecord.selectByChckApprCmntId — orgId를 주면 그 부서와 하위 */
    public List<ChckApprRecordRes> searchRecords(UserPrincipal user, Long chckApprCmntId, Long orgId) {
        CheckApprListRes model = requireOwnAppr(user, chckApprCmntId);
        return mapper.selectRecords(chckApprCmntId, user.getCompanyId(), firstDay(model.checkYm()), orgId);
    }

    // ================= 공통 =================

    /** 로그인 사용자의 승인 행인지 읽어서 확인 — 다른 회사·다른 사람의 행이면 거부 */
    private CheckApprListRes requireOwnAppr(UserPrincipal user, Long chckApprCmntId) {
        CheckApprKey key = mapper.selectApprKey(chckApprCmntId);
        requireFound(key);
        requireCompany(user, key.companyId());
        List<CheckApprListRes> rows = mapper.selectApprs(key.companyId(), key.checkYm(), key.roleId(), user.getUserId(), firstDay(key.checkYm()), chckApprCmntId);
        if (rows.isEmpty()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return rows.get(0);
    }

    private CheckApprManlRes requireManlAppr(UserPrincipal user, Long chckApprCmntId, Long chckManlApprId) {
        return mapper.selectManls(chckApprCmntId, user.getCompanyId(), user.getUserId(), null, false, null).stream()
                .filter(m -> Objects.equals(m.chckManlApprId(), chckManlApprId))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND));
    }

    private CheckApprInsuffRes requireInsuffAppr(UserPrincipal user, CheckApprListRes model, Long chckInsuffApprId) {
        return mapper.selectInsuffs(model.chckApprCmntId(), user.getCompanyId(), firstDay(model.checkYm()), null, false).stream()
                .filter(i -> Objects.equals(i.chckInsuffApprId(), chckInsuffApprId))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND));
    }

    /** 화면이 고른 ID가 모두 이 승인 행의 목록에 있어야 한다 */
    private static <T> List<T> pick(List<T> all, List<Long> ids, java.util.function.Function<T, Long> idOf) {
        if (ids == null) {
            return List.of();
        }
        List<T> picked = all.stream().filter(row -> ids.contains(idOf.apply(row))).toList();
        if (picked.size() != ids.stream().distinct().count()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return picked;
    }

    private void record(Long companyId, String stdDate, Long relateTableId, String relateTable, String procType, Long personId,
                        String procResult, String resultCmnt, String reportCmnt) {
        recordMapper.insertRecord(new CheckRecordParam(companyId, stdDate, relateTableId, relateTable, procType, personId, procResult, resultCmnt, reportCmnt));
    }

    private static LocalDate firstDay(String checkYm) {
        if (checkYm == null || !CHECK_YM.matcher(checkYm).matches()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "점검년월 형식이 올바르지 않습니다");
        }
        return LocalDate.of(Integer.parseInt(checkYm.substring(0, 4)), Integer.parseInt(checkYm.substring(5, 7)), 1);
    }

    private static String requireOneOf(String value, String... allowed) {
        for (String a : allowed) {
            if (a.equals(value)) {
                return value;
            }
        }
        throw fail("정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요");
    }

    private static void requireFound(Object row) {
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private static void requireCompany(UserPrincipal user, Long companyId) {
        if (!Objects.equals(companyId, user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** AS-IS result.fail(-1, 메시지) — 화면이 그 문구를 그대로 보여 준다 */
    private static BusinessException fail(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
