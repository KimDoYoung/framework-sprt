package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistoryRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistorySaveReq;
import kr.co.kfs.asseterp.biz.mkt.dto.MktRelateFundRes;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Z05 Mkt03_Grid_History·Mkt03_Lookup_History → server/mkt/Mkt03_History.java (selectById L19, selectByTargetCompanyId L24, updateOne L48, delete L61),
 * Mkt04_RelateFund.java (selectByHistoryId L21, updateByList L26, delete L40)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktHistoryService {

    private final MktHistoryMapper mapper;

    /** AS-IS getSeq — f_create_seq()는 시퀀스를 올리므로 읽기 전용 트랜잭션이면 안 된다 */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS mkt.Mkt03_History.selectByTargetCompanyId — orgId는 로그인 사원의 조직(LoginUser.getOrgCodeId) */
    public List<MktHistoryRes> search(UserPrincipal user, String itemType, Long targetCompanyId, LocalDate startDate, LocalDate closeDate,
                                      boolean allContactYn, String searchText) {
        String type = itemType == null || itemType.isEmpty() ? "%" : itemType;
        return mapper.selectByTargetCompanyId(user.getCompanyId(), user.getUserId(), orgId(user), type, targetCompanyId, startDate, closeDate,
                allContactYn, "%" + (searchText == null ? "" : searchText) + "%", false);
    }

    /** Z06 Mkt03_Tab_HistoryManager.retrieve — isManager=true(작성자·공유 조건 없음), 구분 전체(`%`) */
    public List<MktHistoryRes> searchManage(UserPrincipal user, Long targetCompanyId, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByTargetCompanyId(user.getCompanyId(), user.getUserId(), orgId(user), "%", targetCompanyId, startDate, closeDate,
                targetCompanyId == null, "%" + (searchText == null ? "" : searchText) + "%", true);
    }

    /** AS-IS mkt.Mkt03_History.selectById */
    public MktHistoryRes get(UserPrincipal user, Long historyId) {
        MktHistoryRes res = mapper.selectById(user.getCompanyId(), historyId);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return res;
    }

    /** AS-IS mkt.Mkt03_History.updateOne → (연결펀드가 있으면) mkt.Mkt04_RelateFund.updateByList. 수정은 작성자만 */
    @Transactional
    public MktHistoryRes save(UserPrincipal user, MktHistorySaveReq req) {
        if (req.historyId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "활동내역 ID가 없습니다.");
        }
        if (req.activityDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "활동일을 선택해주세요");
        }
        if (req.activityTitle() == null || req.activityTitle().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "활동내용은 필수입력 항목입니다");
        }
        Long owner = mapper.selectOwner(user.getCompanyId(), req.historyId());
        if (owner == null) {
            if (req.targetCompanyId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "상단의 활동처를 선택하세요");
            }
            mapper.insertOne(user.getCompanyId(), user.getUserId(), req);
        } else if (!owner.equals(user.getUserId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "작성자가 본인이 아닌 활동내역은 수정할 수 없습니다");
        } else {
            mapper.updateOne(user.getCompanyId(), req);
        }
        if (req.fundIds() != null && !req.fundIds().isEmpty()) {
            mapper.deleteRelateFundsByHistory(user.getCompanyId(), req.historyId());
            for (Long fundId : req.fundIds()) {
                mapper.insertRelateFund(mapper.selectNextId(), req.historyId(), fundId, user.getCompanyId());
            }
        }
        return get(user, req.historyId());
    }

    /** AS-IS mkt.Mkt03_History.delete — 연결펀드·공유정보를 먼저 지우고 활동내역 삭제. 작성자 본인 것만. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        List<Long> owned = mapper.selectOwnedIds(user.getCompanyId(), user.getUserId(), ids);
        if (owned.size() != ids.size()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "작성자가 본인이 아닌 활동내역은 삭제할 수 없습니다");
        }
        int count = 0;
        for (Long id : owned) {
            mapper.deleteRelateFundsByHistory(user.getCompanyId(), id);
            mapper.deleteSharesByParent(user.getCompanyId(), id);
            count += mapper.deleteHistory(user.getCompanyId(), id);
        }
        return count;
    }

    /** AS-IS mkt.Mkt04_RelateFund.selectByHistoryId */
    public List<MktRelateFundRes> searchRelateFunds(UserPrincipal user, Long historyId) {
        return mapper.selectRelateFunds(user.getCompanyId(), historyId);
    }

    /** AS-IS mkt.Mkt04_RelateFund.delete — 연결펀드 삭제 아이콘. 지운 건수 */
    @Transactional
    public int deleteRelateFunds(UserPrincipal user, Long historyId, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteRelateFundsByIds(user.getCompanyId(), historyId, ids);
    }

    private static Long orgId(UserPrincipal user) {
        try {
            return user.getDeptId() == null ? -1L : Long.valueOf(user.getDeptId());
        } catch (NumberFormatException e) {
            return -1L;
        }
    }
}
