package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileStampReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveRow;
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

    /** AS-IS apr.Apr20_RelateIcs.selectByApprId */
    public List<AprRelateIcsRow> getRelateIcs(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectRelateIcs(apprId);
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
        AprApprDetailRes doc = detailService.getDetail(user, apprId);
        String status = doc.statusCode();
        if ("30".equals(status) || "40".equals(status)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재가 완료된 문서는 연관법규 추가/삭제가 불가능합니다");
        }
        if (!"10".equals(status) && !"20".equals(status)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<AprRelateIcsSaveRow> rows = req.rows() == null ? List.of() : req.rows();
        List<Long> deleteIds = req.deleteIds() == null ? List.of() : req.deleteIds();

        Set<Long> mine = new HashSet<>();
        mapper.selectRelateIcs(apprId).forEach(r -> mine.add(r.relateIcsId()));
        for (AprRelateIcsSaveRow r : rows) {
            if (r.relateIcsId() != null && !mine.contains(r.relateIcsId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            String cycle = r.deadlineId() == null ? null : mapper.selectCycleName(r.deadlineId());
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
        mapper.insertNotice(noticeId, user.getCompanyId(), "상신문서 연관법규 변동알림",
                "상신문서 **" + doc.title() + "** 의 연관법규 변동사항이 존재합니다. (수정자 : " + user.getName() + ")");
        mapper.insertNoticeTarget(mapper.selectNextId(), noticeId, doc.regEmpId());

        for (AprRelateIcsSaveRow r : rows) {
            if (r.relateIcsId() == null) {
                mapper.insertRelateIcs(mapper.selectNextId(), apprId, r.classTreeId(), r.standCode(), r.standDate(), r.closeDate(), r.deadlineId());
            } else {
                mapper.updateRelateIcs(r.relateIcsId(), apprId, r.standCode(), r.standDate(), r.closeDate());
            }
        }
        if (!deleteIds.isEmpty()) {
            mapper.deleteRelateIcs(apprId, deleteIds);
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
}
