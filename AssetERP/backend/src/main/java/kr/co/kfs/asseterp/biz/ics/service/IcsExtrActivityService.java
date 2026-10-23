package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivityRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivitySaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsExtrActivityMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS Ics35_Tab_ExtrActivity·Ics35_Edit_ExtrActivity·Ics35_Tab_ExtrActivityList → server/ics/Ics35_ExtrActivity.java (selectByCompanyId L26 / selectByPersonId L39 / modelUpdate L70 / delete L88) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsExtrActivityService {

    private final IcsExtrActivityMapper mapper;

    /** AS-IS selectByPersonId: 로그인 사원 본인의 신청 */
    public List<IcsExtrActivityRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), startDate, closeDate);
    }

    /** AS-IS selectByCompanyId: 로그인 회사 전체(임시저장 제외). unknown이면 기간 없이 결과보고 누락건만 */
    public List<IcsExtrActivityRes> searchForCompany(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean unknown) {
        return mapper.selectByCompanyId(user.getCompanyId(), startDate, closeDate, unknown);
    }

    /** 새 신청을 열 때 받는 id (AS-IS DBUtil.setSeq — 첨부파일을 저장 전에 올리려면 필요) */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS modelUpdate: 필수 항목 검사는 편집 창(update)이 하고, 서버는 id가 없으면 새로 받는다. 기존 행이 없으면 넣는다 → 저장된 행(selectById) */
    @Transactional
    public IcsExtrActivityRes save(UserPrincipal user, IcsExtrActivitySaveReq req) {
        long id = (req.extrActivityId() == null || req.extrActivityId() <= 0) ? mapper.selectNextId() : req.extrActivityId();
        IcsExtrActivitySaveReq row = new IcsExtrActivitySaveReq(id, req.regDate(), req.activityCorp(), req.activityTgtCd(),
                req.activityTgtEtc(), req.activityPeriod(), req.activityDesc(), req.activityPay());
        if (mapper.updateExtrActivity(user.getCompanyId(), row) == 0) {
            mapper.insertExtrActivity(user.getCompanyId(), user.getUserId(), row);
        }
        IcsExtrActivityRes saved = mapper.selectById(id);
        if (saved == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel), 로그인 회사의 행만 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> extrActivityIds) {
        return extrActivityIds.stream().mapToInt(id -> mapper.deleteExtrActivity(id, user.getCompanyId())).sum();
    }
}
