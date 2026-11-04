package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileStampReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFundSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprRelateReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcrOriginRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateSelectRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprRelateEditMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** [연관법규 추가/수정/삭제]·[결재완료후 첨부파일등록] (AS-IS client/vi/apr/Apr20_Lookup_RelateIcsList · Apr20_Lookup_RelateIcs · Apr01_Lookup_ApprFile, server Apr20_RelateIcs, V10) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprRelateEditService {

    private final AprRelateEditMapper mapper;
    private final AprApprDetailService detailService;
    private final AprApprWriteMapper writeMapper;

    /** AS-IS apr.Apr20_RelateIcs.selectByApprId */
    public List<AprRelateIcsRow> getRelateIcs(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectRelateIcs(apprId);
    }

    /** AS-IS apr.Apr22_RelateIcr.selectById — 내규정보 창(원인문서가 있는 연관내규) */
    public AprRelateIcrOriginRes getRelateIcrOrigin(UserPrincipal user, Long relateIcrId) {
        AprRelateIcrOriginRes row = mapper.selectRelateIcrOrigin(relateIcrId, user.getCompanyId());
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS apr.Apr22_RelateIcr.selectByApprId (EE70) */
    public List<AprRelateIcsRow> getRelateIcr(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectRelateIcr(apprId);
    }

    /** AS-IS apr.Apr20_RelateIcs.insertIcs (EE68) — 줄마다 새 relateId. 번호표(f_create_seq)를 쓰므로 읽기 전용 트랜잭션이 아니다 */
    @Transactional
    public List<AprRelateSelectRes> selectRelateIcsByIcs(Long dcrClassTreeId, Long icsClassTreeId) {
        return withIds(mapper.selectRelateIcsByIcs(dcrClassTreeId, icsClassTreeId));
    }

    /** AS-IS apr.Apr22_RelateIcr.insertIcr (EE69) — 줄마다 새 relateId. 번호표를 쓰므로 읽기 전용이 아니다 */
    @Transactional
    public List<AprRelateSelectRes> selectRelateIcrByIcr(Long dcrClassTreeId, Long icrClassTreeId) {
        return withIds(mapper.selectRelateIcrByIcr(dcrClassTreeId, icrClassTreeId));
    }

    private List<AprRelateSelectRes> withIds(List<AprRelateSelectRes> rows) {
        return rows.stream().map(r -> new AprRelateSelectRes(mapper.selectNextId(), r.classTreeId(), r.classTreeName(), r.classTreeFullName(), r.content(),
                r.submitTo(), r.relatedLaw(), r.cycleName(), r.deadlineId(), r.deadlineFullName(), r.deadlineNote(), r.scheduleCodeCheck(), r.closeDate())).toList();
    }

    /** [행 추가]로 고른 법규·기한의 보기 값 (AS-IS는 조회창 결과 모델에서 가져왔다) */
    public AprRelateIcsRow getInfo(Long classTreeId, Long deadlineId, boolean withLaw) {
        AprRelateIcsRow row = mapper.selectRelateIcsInfo(classTreeId, deadlineId, withLaw);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /** 새 연관내규 줄의 보기 값 (V13) */
    public AprRelateIcsRow getInfoIcr(Long classTreeId, Long deadlineId) {
        AprRelateIcsRow row = mapper.selectRelateIcrInfo(classTreeId, deadlineId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /** AS-IS apr.Apr20_RelateIcs.getCloseDate — 기준일에 기한을 적용한 마감일 */
    public LocalDate getCloseDate(UserPrincipal user, Long deadlineId, LocalDate standDate) {
        return mapper.selectCloseDate(deadlineId, standDate, user.getCompanyId());
    }

    /**
     * AS-IS Apr20_Lookup_RelateIcsList.update L173-234 → apr.Apr20_RelateIcs.check L212-293 + deleteList L308-325.
     * 마감일 검사(수시는 발생일 기준일 때만) → 변경이 있으면(AS-IS의 `==` 비교가 늘 달라서 사실상 "남은 줄이나 지운 줄이 있으면") 상신자에게 "상신문서 연관법규 변동알림"을 남기고
     * 줄을 저장(새 줄 추가·기존 줄은 기준/마감 갱신)한 뒤 지운 줄을 지운다. 변경이 없으면 false.
     * 문서가 결재중(10·20)일 때만 — AS-IS는 화면이 결재완료·반려 문서의 추가·삭제를 막았고 단추도 진행 중 문서에만 있다
     */
    @Transactional
    public boolean save(UserPrincipal user, Long apprId, AprRelateIcsSaveReq req) {
        return saveLaw(user, apprId, req, false);
    }

    /**
     * AS-IS Apr22_Lookup_RelateIcrList.update L173-231 → apr.Apr22_RelateIcr.check L206-287 + deleteList L302-319 (EE70) — [연관법규 추가/수정/삭제]와 같은 흐름의 내규판.
     * 알림 제목·본문은 "연관내규", 줄은 apr22_relate_icr, 기한은 스케줄 구분 6·7
     */
    @Transactional
    public boolean saveIcr(UserPrincipal user, Long apprId, AprRelateIcsSaveReq req) {
        return saveLaw(user, apprId, req, true);
    }

    private boolean saveLaw(UserPrincipal user, Long apprId, AprRelateIcsSaveReq req, boolean icr) {
        AprApprDetailRes doc = detailService.getDetail(user, apprId);
        String status = doc.statusCode();
        if ("30".equals(status) || "40".equals(status)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재가 완료된 문서는 " + (icr ? "연관내규" : "연관법규") + " 추가/삭제가 불가능합니다");
        }
        if (!"10".equals(status) && !"20".equals(status)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<AprRelateIcsSaveRow> rows = req.rows() == null ? List.of() : req.rows();
        List<Long> deleteIds = req.deleteIds() == null ? List.of() : req.deleteIds();

        Set<Long> mine = new HashSet<>();
        (icr ? mapper.selectRelateIcr(apprId) : mapper.selectRelateIcs(apprId)).forEach(r -> mine.add(r.relateIcsId()));
        for (AprRelateIcsSaveRow r : rows) {
            if (r.relateIcsId() != null && !mine.contains(r.relateIcsId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            String cycle = r.deadlineId() == null ? null : (icr ? mapper.selectCycleNameIcr(r.deadlineId()) : mapper.selectCycleName(r.deadlineId()));
            boolean missing = "수시".equals(cycle) ? ("20".equals(r.standCode()) && r.closeDate() == null) : r.closeDate() == null;
            if (missing) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "마감일을 입력해주세요");
            }
        }
        if (rows.isEmpty() && deleteIds.isEmpty()) {
            return false;
        }

        // bbs02_notice(알림) + bbs03_target(상신자)
        Long noticeId = mapper.selectNextId();
        mapper.insertNotice(noticeId, user.getCompanyId(), icr ? "상신문서 연관내규 변동알림" : "상신문서 연관법규 변동알림",
                "상신문서 **" + doc.title() + "** 의 " + (icr ? "연관내규" : "연관법규") + " 변동사항이 존재합니다. (수정자 : " + user.getName() + ")");
        mapper.insertNoticeTarget(mapper.selectNextId(), noticeId, doc.regEmpId());

        for (AprRelateIcsSaveRow r : rows) {
            if (r.relateIcsId() == null) {
                if (icr) {
                    mapper.insertRelateIcr(mapper.selectNextId(), apprId, r.classTreeId(), r.standCode(), r.standDate(), r.closeDate(), r.deadlineId());
                } else {
                    mapper.insertRelateIcs(mapper.selectNextId(), apprId, r.classTreeId(), r.standCode(), r.standDate(), r.closeDate(), r.deadlineId());
                }
            } else {
                if (icr) {
                    mapper.updateRelateIcr(r.relateIcsId(), apprId, r.standCode(), r.standDate(), r.closeDate());
                } else {
                    mapper.updateRelateIcs(r.relateIcsId(), apprId, r.standCode(), r.standDate(), r.closeDate());
                }
            }
        }
        if (!deleteIds.isEmpty()) {
            if (icr) {
                mapper.deleteRelateIcr(apprId, deleteIds);
            } else {
                mapper.deleteRelateIcs(apprId, deleteIds);
            }
        }
        return true;
    }

    /** AS-IS sys.Sys10_File.selectByFileYn — 결재완료후 올린 파일 */
    public List<AprAfterFileRes> getAfterFiles(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectAfterFiles(apprId);
    }

    /** AS-IS sys.Sys10_File.update(UpdateDataModel) — [저장]: 인감날인본 체크 */
    @Transactional
    public void saveAfterFiles(UserPrincipal user, Long apprId, AprAfterFileStampReq req) {
        detailService.getDetail(user, apprId);
        if (req.items() == null) {
            return;
        }
        for (AprAfterFileStampReq.Item item : req.items()) {
            mapper.updateFileStamp(item.fileId(), apprId, String.valueOf(item.stampYn()));
        }
    }

    /** AS-IS apr.Apr03_RelateFund.selectByAfterYn — [연관펀드설정] 창 (V16) */
    public List<AprAfterFundRes> getAfterFunds(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectAfterFunds(apprId);
    }

    /**
     * AS-IS apr.Apr03_RelateFund.insert — [확정]: 결재완료 이후 등록한 줄을 모두 지우고 창에 남은 줄을 UpdateDataModel로 넣는다
     * (남아 있는 줄은 UPDATE, 지워진 줄과 새 줄은 INSERT). 새 줄은 결재이후(afterYn)=true, 출력(printYn)=false(Apr01_Lookup_RelateFund L84-90).
     * AS-IS는 단추만 결재완료(30) 문서에 보이게 했지만 TOBE는 서버도 확인한다.
     */
    @Transactional
    public void saveAfterFunds(UserPrincipal user, Long apprId, AprAfterFundSaveReq req) {
        requireCompleted(user, apprId);
        mapper.deleteAfterFunds(apprId);
        if (req == null || req.funds() == null) {
            return;
        }
        for (AprApprRelateReq.Fund row : req.funds()) {
            if (row.fundId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "펀드가 없는 줄이 있습니다.");
            }
            boolean isNew = row.relateFundId() == null || row.relateFundId() <= 0;
            Long id = isNew ? writeMapper.selectNextId() : row.relateFundId();
            if (!isNew && mapper.countRelateFund(apprId, id) > 0) {
                mapper.updateRelateFund(apprId, id, row.fundId(), row.printYn(), row.afterYn()); // 빈 값은 빈 채로(옛 행은 afterYn이 NULL)
            } else {
                // 새 줄이거나, 방금 지워진 결재이후 줄을 같은 번호로 다시 넣는다
                writeMapper.insertRelateFund(id, apprId, new AprApprRelateReq.Fund(id, row.fundId(), orFalse(row.printYn()), isNew ? "true" : orFalse(row.afterYn())));
            }
        }
    }

    /** AS-IS apr.Apr21_RelateAppr.insert — [확정]: 이 문서의 연관문서를 모두 지우고 창에 남은 줄을 넣는다 */
    @Transactional
    public void saveAfterApprs(UserPrincipal user, Long apprId, AprAfterApprSaveReq req) {
        requireCompleted(user, apprId);
        writeMapper.deleteRelateApprsByApprId(apprId);
        if (req == null || req.apprs() == null) {
            return;
        }
        for (AprApprRelateReq.Appr row : req.apprs()) {
            if (row.targetApprId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "연관문서가 없는 줄이 있습니다.");
            }
            Long id = row.relateApprId() == null || row.relateApprId() <= 0 ? writeMapper.selectNextId() : row.relateApprId();
            writeMapper.insertRelateAppr(id, apprId, new AprApprRelateReq.Appr(id, row.targetApprId()));
        }
    }

    private void requireCompleted(UserPrincipal user, Long apprId) {
        AprApprBrief brief = writeMapper.selectBrief(apprId, user.getCompanyId());
        if (brief == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "문서를 찾을 수 없습니다.");
        }
        if (!"30".equals(brief.statusCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재완료된 문서만 연관문서·연관펀드를 설정할 수 있습니다.");
        }
    }

    private static String orFalse(String yn) {
        return yn == null ? "false" : yn;
    }
}
