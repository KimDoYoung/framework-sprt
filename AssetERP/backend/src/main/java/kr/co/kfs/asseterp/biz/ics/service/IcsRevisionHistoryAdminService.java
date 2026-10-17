package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionLawRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsRevisionHistoryAdminMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Ics20_Tab_RevisionHistoryAdmin·Ics20_Edit_RevisionHistoryAdmin → server/ics/Ics20_RevisionHistory.java (selectByDate L26 / update L71 / delete L76)
 * + server/ics/Ics19_RevisionRelateIcs.java (update L27 / delete L32). 쓰기는 관리자 회사만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsRevisionHistoryAdminService {

    private final IcsRevisionHistoryAdminMapper mapper;

    /** AS-IS selectByDate: 소관부처 전체는 '%', 검색어·조문은 %…%. dateType 'reg'면 등록일 아니면 시행일 기준 */
    public List<IcsRevisionHistoryAdminRes> search(LocalDate startDate, LocalDate closeDate, String financeAgencyCode,
                                                   String searchText, String relatedLawSearchText, String dateType) {
        String agency = (financeAgencyCode == null || financeAgencyCode.isBlank()) ? "%" : financeAgencyCode;
        return mapper.selectByDate(startDate, closeDate, agency, like(searchText), like(relatedLawSearchText), dateType);
    }

    /** AS-IS Ics20_RevisionHistory.update(UpdateDataModel): id가 없거나 0 이하면 새 id로 넣고, 아니면 고친다 → 저장된 행(selectById) */
    @Transactional
    public IcsRevisionHistoryAdminRes save(UserPrincipal user, IcsRevisionHistoryAdminSaveReq req) {
        IcsClassTreeService.requireSysAdmin(user);
        Long id = req.revisionHistoryId();
        if (id == null || id <= 0) {
            id = mapper.selectNextId();
            mapper.insert(id, req);
        } else if (mapper.update(id, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "개정내역을 찾을 수 없습니다.");
        }
        return mapper.selectById(id);
    }

    /** AS-IS Ics20_RevisionHistory.delete: ID로만 지운다(연결 법규·첨부파일은 원본도 그대로 둔다) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long revisionHistoryId) {
        IcsClassTreeService.requireSysAdmin(user);
        return mapper.deleteById(revisionHistoryId);
    }

    /** AS-IS Ics19_RevisionRelateIcs.selectByRevisionHistoryId */
    public List<IcsRevisionLawRes> searchLaws(Long revisionHistoryId) {
        return mapper.selectLaws(revisionHistoryId);
    }

    /** AS-IS Ics19_RevisionRelateIcs.update(UpdateDataModel): 고른 법규마다 연결 행을 새 id로 넣는다 → 넣은 행(요청 순서) */
    @Transactional
    public List<IcsRevisionLawRes> addLaws(UserPrincipal user, Long revisionHistoryId, List<Long> classTreeIds) {
        IcsClassTreeService.requireSysAdmin(user);
        if (mapper.selectById(revisionHistoryId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "개정내역을 찾을 수 없습니다.");
        }
        return classTreeIds.stream().map(classTreeId -> {
            long id = mapper.selectNextId();
            mapper.insertLaw(id, revisionHistoryId, classTreeId);
            return mapper.selectLawById(id);
        }).toList();
    }

    /** AS-IS Ics19_RevisionRelateIcs.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int deleteLaws(UserPrincipal user, List<Long> revisionRelateIcsIds) {
        IcsClassTreeService.requireSysAdmin(user);
        return revisionRelateIcsIds.stream().mapToInt(mapper::deleteLawById).sum();
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}
