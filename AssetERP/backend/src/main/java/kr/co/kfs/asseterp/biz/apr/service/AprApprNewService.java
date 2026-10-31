package kr.co.kfs.asseterp.biz.apr.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprNewRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprGroupMemberRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewClassRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewCompanyRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewDocTypeRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewLawRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprOrgHeadRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampInfoRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampLineRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepPersonRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprDetailMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * 새 문서 열기 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc.insertApproval L1491-1521·L4461-4519 → Apr03_Page_Relate.createIcsLine·createIcrLine·createApprStepLine
 * → server apr.Apr04_ApprStep.selectByApprovalTypeCd = createApprovalTypeCd L1175-1853, V06). 문서 번호를 먼저 받고 기본값·기본 결재선·연관법규/내규를 돌려준다. DB는 바꾸지 않는다(저장은 V03 PUT).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprNewService {

    private final AprApprNewMapper mapper;
    private final AprApprDetailMapper altMapper;

    /** 번호표(f_create_seq)를 쓰므로 읽기 전용 트랜잭션이 아니다 — nextval은 읽기 전용에서 PostgreSQL이 거부한다 */
    @Transactional
    public AprApprNewRes open(UserPrincipal user, Long classTreeId) {
        Long companyId = user.getCompanyId();
        Long me = user.getUserId();
        AprNewClassRow tree = mapper.selectClassTree(classTreeId, companyId);
        if (tree == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "문서분류를 찾을 수 없습니다.");
        }
        AprNewDocTypeRow docType = mapper.selectDefaultDocType(classTreeId, companyId);
        AprNewCompanyRow company = mapper.selectCompany(companyId);
        Long apprId = mapper.selectNextId();
        List<AprNewStepRes> steps = createSteps(user, tree, company);
        // Apr20_RelateIcs·Apr22_RelateIcr.selectByDcrClassTreeId: 줄마다 새 relateId
        List<AprNewLawRes> ics = withIds(mapper.selectIcsLines(classTreeId));
        List<AprNewLawRes> icr = withIds(mapper.selectIcrLines(classTreeId));
        return new AprApprNewRes(apprId, classTreeId, tree.classTreeFullName(), tree.printFundYn(), tree.sealCode(),
                docType == null ? null : docType.title(), docType == null ? null : docType.content(), mapper.selectToday(),
                company == null ? null : company.companyName(), company == null ? null : company.companyRepName(), "10", me, user.getName(),
                steps, ics, icr);
    }

    /**
     * 인감을 고른 뒤의 결재선 (V12). 인감 없음(stampId null)이면 기본 결재선만 다시 만든다.
     * checkRole은 새 문서의 기본 인감(retrieveRoleStamp L4586-4618 → Org10_RoleStamp.checkRole)에서만 켠다 — 조회창에서 고른 인감은 검사하지 않는다(findLookupStamp L5160)
     */
    @Transactional
    public AprStampLineRes stampLine(UserPrincipal user, Long classTreeId, Long stampId, boolean checkRole) {
        AprNewClassRow tree = mapper.selectClassTree(classTreeId, user.getCompanyId());
        if (tree == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "문서분류를 찾을 수 없습니다.");
        }
        AprNewCompanyRow company = mapper.selectCompany(user.getCompanyId());
        List<AprNewStepRes> steps = createSteps(user, tree, company);
        if (stampId == null) {
            return new AprStampLineRes(true, null, null, null, null, false, steps);
        }
        if (checkRole) {
            // Org10_RoleStamp.checkRole: 사용기한(3)을 먼저, 그다음 부서 권한(2)
            if (mapper.countStampOpen(stampId) == 0) {
                return new AprStampLineRes(false, "해당문서분류에 지정된 인감의 사용기한이 지났습니다. 관리자에게 문의하세요", null, null, null, false, steps);
            }
            if (mapper.countStampRole(stampId, mapper.selectOrgCodeId(user.getUserId())) == 0) {
                return new AprStampLineRes(false, "해당문서분류에 지정된 인감을 사용할 수 없는 부서입니다. 관리자에게 문의하세요", null, null, null, false, steps);
            }
        }
        AprStampInfoRow stamp = mapper.selectStampById(stampId);
        if (stamp == null) {
            return new AprStampLineRes(true, null, null, null, null, false, steps);
        }
        return new AprStampLineRes(true, null, stamp.stampId(), stamp.stampName(), stamp.stampIdString(), true,
                addStampSteps(steps, stamp, tree, company, user.getCompanyId()));
    }

    /**
     * findStampEmpId L5213-5245 · setObseverOfficer L5253 · setComplianceOfficer L5350 · setStampStepTypeCode L5248 · changeStep L5615-5730.
     * 원본은 세 줄을 비동기로 따로 넣고 순번을 넣기 전 줄 수로 정하므로 세 줄의 순번이 모두 같다(줄 수 + 3). 도착 순서는 인감 → 준법감시인 → 컴플라이언스로 본다.
     */
    private List<AprNewStepRes> addStampSteps(List<AprNewStepRes> base, AprStampInfoRow stamp, AprNewClassRow tree, AprNewCompanyRow company,
                                              Long companyId) {
        Long stampEmpId = stamp.aprEmpId();
        List<AprNewStepRes> out = new ArrayList<>(base);
        if (stampEmpId == null) {
            return out; // 원본: 인감책임자가 없으면 stampEmpId.equals(..)에서 NullPointerException으로 줄이 들어가지 않는다
        }
        String seq = String.format("%03d", base.size() + 3);
        boolean lock = company != null && "true".equals(company.apprStepLockYn());

        // setStampStepTypeCode: 인감합의 여부가 true이고 인감책임자의 오늘 발령이 있을 때 인감(40) 줄. 같은 사람이 이미 있어도 넣는다(40은 중복 검사 제외)
        AprStepPersonRow stampEmp = mapper.selectStampEmp(null, stampEmpId);
        if (stampEmp != null && "true".equals(stamp.stepUseYn())) {
            AprAltRow alt = altMapper.selectAltByEmp(stampEmpId);
            String name = null;
            if (alt != null && "true".equals(alt.stampYn())) {
                AprStepPersonRow second = stamp.secondEmpId() == null ? null : mapper.selectStampEmp(null, stamp.secondEmpId());
                if (second != null) {
                    name = "<b>부) </b>" + plain(second.titleName(), second.korName(), second.orgKorName());
                }
            } else {
                name = "<b>정) </b>" + plain(stampEmp.titleName(), stampEmp.korName(), stampEmp.orgKorName());
            }
            if (name != null) {
                out.add(new AprNewStepRes(mapper.selectNextId(), seq, "40", "인감", "10", "대기", stampEmpId, null, name, true,
                        stampEmp.titleName(), stampEmp.korName(), stampEmp.orgKorName()));
            }
        }
        // setObseverOfficer(합의 20, 직급 120) · setComplianceOfficer(참조 30, 직급 121): 인감책임자와 같은 사람이면 넣지 않고, 이미 결재선에 있어도 넣지 않는다
        addStampOfficer(out, base, mapper.selectOfficers(companyId, null, tree.classTreeId(), "120", "comp"), stampEmpId, seq, "20", lock);
        addStampOfficer(out, base, mapper.selectOfficers(companyId, null, tree.classTreeId(), "121", "comp"), stampEmpId, seq, "30", lock);
        return out;
    }

    /** changeStep(20·30): 결과의 첫 줄만 쓴다(getResult(0)). 중복 검사는 줄을 넣기 전의 결재선(base)로 한다 */
    private void addStampOfficer(List<AprNewStepRes> out, List<AprNewStepRes> base, List<AprStepPersonRow> officers, Long stampEmpId, String seq, String type,
                                 boolean lock) {
        if (officers.isEmpty()) {
            return;
        }
        AprStepPersonRow o = officers.get(0);
        if (Objects.equals(stampEmpId, o.personId()) || base.stream().anyMatch(s -> Objects.equals(s.stepEmpId(), o.personId()))) {
            return;
        }
        AprAltRow alt = altMapper.selectAltByEmp(o.personId());
        boolean ref = "30".equals(type);
        String name;
        if (alt == null) {
            name = plain(o.titleName(), o.korName(), o.orgKorName());
        } else {
            name = ref ? plain(alt.altTitleName(), alt.altEmpName(), alt.altOrgName()) : both(alt);
        }
        out.add(new AprNewStepRes(mapper.selectNextId(), seq, type, ref ? "참조" : "합의", ref ? "" : "10", ref ? "" : "대기", o.personId(), null, name, lock,
                o.titleName(), o.korName(), o.orgKorName()));
    }

    private List<AprNewLawRes> withIds(List<AprNewLawRes> rows) {
        List<AprNewLawRes> out = new ArrayList<>();
        for (AprNewLawRes r : rows) {
            out.add(new AprNewLawRes(mapper.selectNextId(), r.classTreeId(), r.classTreeName(), r.classTreeFullName(), r.content(), r.submitTo(),
                    r.relatedLaw(), r.cycleName(), r.deadlineId(), r.deadlineFullName(), r.deadlineNote()));
        }
        return out;
    }

    /** createApprovalTypeCd L1175-1853 */
    private List<AprNewStepRes> createSteps(UserPrincipal user, AprNewClassRow tree, AprNewCompanyRow company) {
        Long companyId = user.getCompanyId();
        Long me = user.getUserId();
        Long myOrgId = mapper.selectOrgCodeId(me);
        Long classTreeId = tree.classTreeId();

        // 1. 상신자 + 조직장들 (상신자와 같거나 이미 있으면 뺀다)
        List<Long> stepEmpIds = new ArrayList<>();
        List<Long> stepOrgIds = new ArrayList<>();
        stepEmpIds.add(me);
        stepOrgIds.add(myOrgId);
        if (tree.approvalTypeCode() != null) {
            for (AprOrgHeadRow h : mapper.selectOrgHeads(companyId, null, myOrgId, tree.approvalTypeCode())) {
                if (!Objects.equals(h.personId(), me) && !stepEmpIds.contains(h.personId())) {
                    stepEmpIds.add(h.personId());
                    stepOrgIds.add(h.orgCodeId());
                }
            }
        }

        // 2. 사람마다 대결자를 찾아 이름 문구를 만든다. 대결자가 둘 이상이면 요청한 사람(상신자)의 조직 기준 대결자 (L84-96)
        List<AprNewStepRes> result = new ArrayList<>();
        for (int i = 0; i < stepEmpIds.size(); i++) {
            Long empId = stepEmpIds.get(i);
            AprStepPersonRow p = mapper.selectPersonLine(null, empId, stepOrgIds.get(i));
            AprAltRow alt = altMapper.selectAltCount(empId) > 1 ? altMapper.selectAltByOrg(empId, myOrgId) : altMapper.selectAltByEmp(empId);
            if (p == null) {
                continue;
            }
            String type = i == 0 ? "00" : "10";
            String name;
            Long apprEmpId = null;
            if (alt != null) {
                if ("00".equals(type)) {
                    name = plain(p.titleName(), p.korName(), p.orgTitleName());
                    apprEmpId = empId;
                } else {
                    name = both(alt);
                    apprEmpId = alt.altEmpId();
                }
            } else {
                name = plain(p.titleName(), p.korName(), p.orgKorName());
            }
            result.add(step(String.format("%03d", i + 1), type, "10", empId, apprEmpId, name, p));
        }

        // 3~7. 준법감시인·위험관리인·경영관리 합의(20), 위험관리참조·컴플라이언스 참조(30). 이미 결재선에 있으면 넣지 않는다.
        // 순번은 모두 상신자+조직장 수 + 1이다(원본 그대로 — 같은 번호가 겹친다)
        int base = stepEmpIds.size();
        addOfficers(result, mapper.selectOfficers(companyId, null, classTreeId, "120", "comp").stream().limit(1).toList(), base, "20");
        addOfficers(result, mapper.selectOfficers(companyId, null, classTreeId, "130", "risk").stream().limit(1).toList(), base, "20");
        addOfficers(result, mapper.selectOfficers(companyId, null, classTreeId, "110", "mngm").stream().limit(1).toList(), base, "20");
        addOfficers(result, mapper.selectOfficers(companyId, null, classTreeId, "131", "risk"), base, "30");
        addOfficers(result, mapper.selectOfficers(companyId, null, classTreeId, "121", "comp").stream().limit(1).toList(), base, "30");

        // 8. 문서분류에 지정된 결재선 그룹
        for (AprGroupMemberRow m : mapper.selectGroupMembers(companyId, null, classTreeId)) {
            AprAltRow alt = altMapper.selectAltByEmp(m.personId());
            if (result.stream().anyMatch(s -> Objects.equals(s.stepEmpId(), m.personId()))) {
                continue;
            }
            String seq = String.format("%03d", base + result.size() + 1);
            boolean ref = "30".equals(m.stepTypeCode());
            String name;
            Long apprEmpId = null;
            if (alt != null) {
                name = ref ? plain(alt.altTitleName(), alt.altEmpName(), alt.altOrgName()) : both(alt);
                apprEmpId = alt.altEmpId();
            } else {
                name = plain(m.titleName(), m.korName(), m.orgTitleName());
            }
            result.add(new AprNewStepRes(mapper.selectNextId(), seq, m.stepTypeCode(), m.stepTypeName(), ref ? null : "10", ref ? null : "대기",
                    m.personId(), apprEmpId, name, false, m.titleName(), m.korName(), m.orgTitleName()));
        }

        // 회사 설정에 따라 모든 단계를 잠근다 (L1833-1851)
        boolean lock = company != null && "true".equals(company.apprStepLockYn());
        List<AprNewStepRes> finalList = new ArrayList<>();
        for (AprNewStepRes s : result) {
            finalList.add(new AprNewStepRes(s.apprStepId(), s.seq(), s.stepTypeCode(), s.stepTypeName(), s.stepStatusCode(), s.stepStatusName(),
                    s.stepEmpId(), s.apprEmpId(), s.stepApprName(), lock, s.titleName(), s.empKorName(), s.orgKorName()));
        }
        return company == null ? List.of() : finalList;
    }

    private void addOfficers(List<AprNewStepRes> result, List<AprStepPersonRow> officers, int base, String type) {
        for (AprStepPersonRow o : officers) {
            if (result.stream().anyMatch(s -> Objects.equals(s.stepEmpId(), o.personId()))) {
                continue;
            }
            AprAltRow alt = altMapper.selectAltByEmp(o.personId());
            String name = alt != null ? both(alt) : plain(o.titleName(), o.korName(), o.orgKorName());
            boolean ref = "30".equals(type);
            result.add(new AprNewStepRes(mapper.selectNextId(), String.format("%03d", base + 1), type, ref ? "참조" : "합의", ref ? "" : "10", ref ? "" : "대기",
                    o.personId(), alt != null ? alt.altEmpId() : null, name, false, o.titleName(), o.korName(), o.orgKorName()));
        }
    }

    private AprNewStepRes step(String seq, String type, String status, Long empId, Long apprEmpId, String name, AprStepPersonRow p) {
        return new AprNewStepRes(mapper.selectNextId(), seq, type, "00".equals(type) ? "상신" : "결재", status, "대기", empId, apprEmpId, name, false,
                p.titleName(), p.korName(), p.orgKorName());
    }

    private static String plain(String title, String name, String org) {
        return title + " " + name + "(" + org + ")";
    }

    private static String both(AprAltRow a) {
        return "<b>대결) </b>" + a.altTitleName() + " " + a.altEmpName() + "(" + a.altOrgName() + ")"
                + "<br><br><b>본결) </b>" + a.targetTitleName() + " " + a.targetEmpName() + "(" + a.targetOrgName() + ")";
    }
}
