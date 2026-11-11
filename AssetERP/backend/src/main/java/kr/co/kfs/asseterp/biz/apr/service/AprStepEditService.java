package kr.co.kfs.asseterp.biz.apr.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeStep;
import kr.co.kfs.asseterp.biz.apr.dto.AprRecentDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRetouchReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRetouchStepRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepEmpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepLineReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepPersonReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepPosRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepPersonRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprDetailMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprStepEditMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;

/** 결재선 설정 창 (AS-IS client/vi/apr/Apr04_Edit_ApprStep: retrieveTransInfo·insertApprovalEmp·allReference·orgReference·apprStepLockYnChk, V07). 저장은 하지 않는다 — 고른 결과는 문서 저장(V03 PUT) 때 같이 간다 */
@Service
@RequiredArgsConstructor
@Transactional
public class AprStepEditService {

    private final AprStepEditMapper mapper;
    private final AprApprNewMapper newMapper;
    private final AprApprDetailMapper altMapper;
    private final AprApprWriteMapper writeMapper;
    private final AprApprActionService action;
    private final AprApprDetailService detail;
    private final AprNoticeService notice;

    /** 사원 조회. mode: text | org | all | orgDown */
    @Transactional(readOnly = true)
    public List<AprStepEmpRes> emps(UserPrincipal user, String mode, String searchText, Long orgCodeId, boolean includeYn) {
        return mapper.selectEmps(user.getCompanyId(), null, mode, searchText == null ? "" : searchText, orgCodeId, includeYn);
    }

    /** insertApprovalEmp L419-514 — 새 결재선 줄(이름 문구는 대결자가 있으면 대결/본결). 번호(seq)는 창이 다시 매긴다(getSeq) */
    public List<AprNewStepRes> lines(UserPrincipal user, AprStepLineReq req) {
        String type = req.stepTypeCode();
        List<AprNewStepRes> out = new ArrayList<>();
        for (AprStepPersonReq p : req.persons()) {
            AprStepPersonRow row = newMapper.selectPersonLine(null, p.personId(), p.orgCodeId());
            if (row == null) {
                continue;
            }
            AprAltRow alt = altMapper.selectAltByEmp(p.personId());
            String name;
            if (alt != null) {
                name = "30".equals(type)
                        ? alt.targetTitleName() + " " + alt.targetEmpName() + "(" + alt.targetOrgName() + ")"
                        : "<b>대결) </b>" + alt.altTitleName() + " " + alt.altEmpName() + "(" + alt.altOrgName() + ")"
                                + "<br><br><b>본결) </b>" + alt.targetTitleName() + " " + alt.targetEmpName() + "(" + alt.targetOrgName() + ")";
            } else {
                name = row.titleName() + " " + row.korName() + "(" + row.orgKorName() + ")";
            }
            // 10·20은 대기, 30은 빈 값, 그 밖(예: 불러온 문서의 인감 40)은 원본도 이름 "????"에 상태를 채우지 않는다
            boolean wait = "10".equals(type) || "20".equals(type);
            boolean ref = "30".equals(type);
            String typeName = "10".equals(type) ? "결재" : "20".equals(type) ? "합의" : ref ? "참조" : "????";
            out.add(new AprNewStepRes(newMapper.selectNextId(), null, type, typeName, wait ? "10" : ref ? "" : null, wait ? "대기" : ref ? "" : null,
                    p.personId(), null, name, false, row.titleName(), row.korName(), row.orgKorName()));
        }
        return out;
    }

    /** arrayPosCode L1952-1974 — 직급순 재정렬에 쓰는 직위 코드 */
    @Transactional(readOnly = true)
    public List<AprStepPosRes> posCodes(UserPrincipal user, List<Long> personIds) {
        return personIds == null || personIds.isEmpty() ? List.of() : mapper.selectPosCodes(user.getCompanyId(), personIds);
    }

    /** apprStepLockYnChk L306-320 — 회사가 결재선을 잠그면 [불러오기]가 사라진다 */
    @Transactional(readOnly = true)
    public boolean locked(UserPrincipal user) {
        var company = newMapper.selectCompany(user.getCompanyId());
        return company != null && "true".equals(company.apprStepLockYn());
    }

    // ───────────────────────── V08 ─────────────────────────

    /** Apr01_Lookup_ApprList.retrieve L160-182: mode week(최근 7일 상신문서) | group(문서분류별 최근상신문서, 제목 검색) */
    @Transactional(readOnly = true)
    public List<AprRecentDocRes> recentDocs(UserPrincipal user, String mode, String searchText) {
        if ("group".equals(mode)) {
            return mapper.selectRecentByGroup(user.getCompanyId(), user.getUserId(), "%" + (searchText == null ? "" : searchText) + "%");
        }
        return mapper.selectRecentByWeek(user.getCompanyId(), user.getUserId(), newMapper.selectToday());
    }

    /**
     * Apr01_Lookup_ApprList.update L205-225(getApprStepList) → Apr04_Edit_ApprStep.recentLoad L582-625: 고른 문서의 결재선(상신자 제외)을 사원마다 오늘 재직 정보로 다시 만든다.
     * 재직(발령 899 이하 — 겸직 포함, AS-IS getPersonId 2026-11-03)이 아니라 찾을 수 없는 사원은 건너뛴다. 번호(seq)와 상신자 줄은 창이 다시 정한다
     */
    public List<AprNewStepRes> recentLines(UserPrincipal user, Long apprId) {
        if (writeMapper.selectBrief(apprId, user.getCompanyId()) == null) {
            return List.of();
        }
        List<AprNewStepRes> out = new ArrayList<>();
        for (AprRetouchStepRow s : mapper.selectStepList(apprId)) {
            if ("00".equals(s.stepTypeCode())) {
                continue;
            }
            List<AprStepEmpRes> emp = mapper.selectEmps(user.getCompanyId(), s.stepEmpId(), "person", null, null, false);
            if (emp.isEmpty()) {
                continue;
            }
            out.addAll(lines(user, new AprStepLineReq(s.stepTypeCode(), List.of(new AprStepPersonReq(s.stepEmpId(), emp.get(0).orgCodeId())))));
        }
        return out;
    }

    /**
     * Apr04_Edit_RetouchApprStep.update L221-251 → apr.Apr04_ApprStep.updateList L2125-2257(V08): 결재중 문서의 결재선 수정.
     * 지운 줄(deleteStepIds)을 지우고, 남은 줄은 번호를 바꾸고 새 줄은 넣는다. 저장할 결재선에서 처음으로 대기인 결재·합의 사원에게 알림.
     * AS-IS는 클라이언트가 보낸 줄을 그대로 믿었다 → TOBE는 [결재선 수정]을 쓸 수 있는 사원(내 차례, 합의 아님)만, 지우는 줄은 내가 넣은·잠기지 않은·결재 전 줄만 허용한다
     */
    public AprApprWriteRes retouch(UserPrincipal user, Long apprId, AprRetouchReq req) {
        AprApprBrief brief = writeMapper.selectBrief(apprId, user.getCompanyId());
        if (brief == null) {
            return fail("문서를 찾을 수 없습니다.");
        }
        if (!action.canRetouchSteps(user, apprId)) {
            return fail("결재선을 수정할 수 없는 문서입니다.");
        }
        Long me = user.getUserId();
        List<AprRetouchStepRow> old = mapper.selectStepList(apprId);
        Set<Long> oldIds = new HashSet<>();
        old.forEach(o -> oldIds.add(o.apprStepId()));
        Set<Long> deletes = new HashSet<>(req.deleteStepIds() == null ? List.of() : req.deleteStepIds());
        for (AprRetouchStepRow o : old) {
            if (deletes.contains(o.apprStepId())
                    && ("true".equals(o.lockYn()) || !Objects.equals(me, o.addEmpId()) || o.apprDate() != null || "00".equals(o.stepTypeCode()))) {
                return fail("해당 결재선은 삭제불가능합니다");
            }
        }
        if (!oldIds.containsAll(deletes)) {
            return fail("저장에 실패했습니다. 관리자에게 문의하세요");
        }
        deletes.forEach(id -> mapper.deleteStep(id, apprId));
        List<AprApprSaveStepReq> steps = req.steps() == null ? List.of() : req.steps();
        for (AprApprSaveStepReq s : steps) {
            if (s.apprStepId() != null && oldIds.contains(s.apprStepId())) {
                mapper.updateStepSeq(s.apprStepId(), apprId, s.seq());
            } else {
                boolean wait = "10".equals(s.stepTypeCode()) || "20".equals(s.stepTypeCode());
                if (!wait && !"30".equals(s.stepTypeCode())) {
                    return fail("저장에 실패했습니다. 관리자에게 문의하세요");
                }
                Long id = s.apprStepId() != null ? s.apprStepId() : newMapper.selectNextId();
                writeMapper.insertStep(id, apprId, s.stepTypeCode(), s.seq(), wait ? "10" : "", s.stepEmpId(), null, null, null, "false", me, null);
            }
        }
        AprApprDetailRes doc = detail.getDetail(user, apprId);
        List<AprNoticeStep> noticeSteps = new ArrayList<>();
        for (AprRetouchStepRow r : mapper.selectStepList(apprId)) {
            noticeSteps.add(new AprNoticeStep(apprId, r.seq(), r.stepTypeCode(), r.stepStatusCode(), r.stepEmpId(), r.apprDate()));
        }
        notice.dispatchAfterCommit(notice.planAfterRetouch(doc.companyId(), noticeSteps));
        return new AprApprWriteRes(true, null, apprId, doc.statusCode(), false, null);
    }

    private static AprApprWriteRes fail(String message) {
        return new AprApprWriteRes(false, message, null, null, false, null);
    }
}
