package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttPmWorkRes;
import kr.co.kfs.asseterp.biz.att.dto.AttPmWorkSaveReq;
import kr.co.kfs.asseterp.biz.att.mapper.AttPmWorkMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** AS-IS client/vi/att/Att05_Lookup_PmWork(오후근무신청 창) + server/att/Att05_PmWork — 내 오후근무 신청만 다룬다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttPmWorkService {

    private final AttPmWorkMapper mapper;

    /** retrieve() L376: att.Att05_PmWork.selectByWorkDate(companyId, 내 ID, 신청일자) */
    public List<AttPmWorkRes> search(UserPrincipal user, LocalDate workDate) {
        if (workDate == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "신청일자를 지정해주세요");
        return mapper.selectByWorkDate(user.getCompanyId(), user.getUserId(), workDate);
    }

    /** 결재완료(10 상신·20 진행·30 완료)는 수정·삭제 불가 */
    private static boolean locked(String statusCode) {
        return "10".equals(statusCode) || "20".equals(statusCode) || "30".equals(statusCode);
    }

    /**
     * updateChk01 L267 → updateChk02 L293 → updateChk03 L346 → update L366.
     * ① 바뀐 행: 결재 중·완료 수정 불가 / 근무일자·사유 필수 ② 화면 밖 내 신청과 합쳐 같은 근무일자 중복 불가 ③ 신청일자에 연장근무 신청이 있으면 불가 ④ 저장.
     */
    @Transactional
    public void save(UserPrincipal user, AttPmWorkSaveReq req) {
        if (req == null || req.rows() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        List<AttPmWorkSaveReq.Row> rows = req.rows();

        List<Long> savedIds = rows.stream().map(AttPmWorkSaveReq.Row::pmWorkId).filter(i -> i != null && i > 0).toList();
        Set<Long> lockedIds = new HashSet<>();
        if (!savedIds.isEmpty()) {
            for (AttPmWorkRes r : mapper.selectByIds(companyId, personId, savedIds)) {
                if (locked(r.statusCode())) lockedIds.add(r.pmWorkId());
            }
        }
        for (AttPmWorkSaveReq.Row r : rows) {
            if (!r.changed()) continue;
            if (lockedIds.contains(r.pmWorkId())) throw new BusinessException(ErrorCode.INVALID_INPUT, "결재완료된 항목은 수정이 불가능합니다");
            if (r.workDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "근무일자를 지정해주세요");
            if (r.reason() == null || r.reason().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "사유를 입력해주세요");
        }

        // updateChk02: 화면의 모든 행 + 화면에 없는 내 신청
        List<LocalDate> dates = new ArrayList<>();
        rows.forEach(r -> dates.add(r.workDate()));
        mapper.notInPmWorkIdList(companyId, personId, savedIds).forEach(o -> dates.add(o.workDate()));
        for (int i = 0; i < dates.size(); i++) {
            for (int j = i + 1; j < dates.size(); j++) {
                if (dates.get(i) != null && dates.get(i).equals(dates.get(j))) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "같은 근무일자에 이미 신청내역이 존재합니다.");
                }
            }
        }

        // updateChk03
        if (req.baseDate() != null && mapper.countOvertimeByDate(personId, req.baseDate()) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "해당일자 연장근무 신청 내역이 있습니다. 취소 후 진행해주세요");
        }

        for (AttPmWorkSaveReq.Row r : rows) {
            if (!r.changed()) continue;
            if (r.pmWorkId() != null && r.pmWorkId() > 0 && mapper.update(r.pmWorkId(), r.workDate(), r.reason()) > 0) continue;
            Long id = r.pmWorkId() != null && r.pmWorkId() > 0 ? r.pmWorkId() : mapper.selectNextId();
            mapper.insert(id, companyId, personId, r.workDate(), r.reason());
        }
    }

    /** deleteRow L391: 결재 중·완료는 삭제 불가 → delete */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        for (AttPmWorkRes r : mapper.selectByIds(user.getCompanyId(), user.getUserId(), ids)) {
            if (locked(r.statusCode())) throw new BusinessException(ErrorCode.INVALID_INPUT, "결재완료된 항목은 삭제불가능합니다");
        }
        return mapper.delete(user.getCompanyId(), user.getUserId(), ids);
    }

    /** updateApprId L233: 상신한 문서 ID를 행에 기록 */
    @Transactional
    public void updateApprId(UserPrincipal user, Long pmWorkId, Long apprId) {
        if (mapper.updateApprId(user.getCompanyId(), user.getUserId(), pmWorkId, apprId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
