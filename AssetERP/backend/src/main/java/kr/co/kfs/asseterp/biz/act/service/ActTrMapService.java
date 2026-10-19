package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.TrMapInitReq;
import kr.co.kfs.asseterp.biz.act.dto.TrMapRes;
import kr.co.kfs.asseterp.biz.act.dto.TrMapSaveReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapMapper;
import kr.co.kfs.asseterp.biz.act.mapper.ActTrMapMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/act/Act11_TrMap.java (selectByCompanyId L25, insertInitData L31, update L52, delete L57) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActTrMapService {

    private final ActTrMapMapper mapper;
    private final ActJournalMapMapper journalMapper;

    /** AS-IS Act11_Tab_TrJournalMap.retrieve() L385-419: 로그인 회사, 거래코드/명·분개그룹은 "%검색어%"(없으면 "%") */
    public List<TrMapRes> search(UserPrincipal user, String searchText, String journalGroup) {
        return mapper.selectByCompanyId(user.getCompanyId(), likeText(searchText), likeText(journalGroup));
    }

    /**
     * AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하·없음)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     * 거래코드 필수 검사는 화면 update() L422-437의 문구 그대로
     */
    @Transactional
    public List<TrMapRes> update(UserPrincipal user, List<TrMapSaveReq> rows) {
        for (TrMapSaveReq req : rows) {
            if (isBlank(req.trCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "거래코드는 필수입력 항목입니다.");
            }
        }
        List<TrMapRes> saved = new ArrayList<>();
        for (TrMapSaveReq req : rows) {
            boolean isNew = req.trMapId() == null || req.trMapId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.trMapId();
            if (isNew) {
                mapper.insert(id, user.getCompanyId(), req);
            } else if (mapper.update(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /**
     * AS-IS insertInitData L31-46: 고른 (거래코드, 분개그룹)마다 고른 고객사에서 같은 거래맵핑과 분개맵핑(그 분개그룹 전체)을 지우고
     * 관리자 회사(0) 것을 복사한다 → 처리한 고객사 수. 원본은 고객사마다 서비스를 따로 불렀다 — 여기서는 한 트랜잭션. 관리자 회사만(원본은 버튼 노출만 막았다)
     */
    @Transactional
    public int insertInitData(UserPrincipal user, TrMapInitReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<Long> companyIds = req.companyIds() == null ? List.of() : req.companyIds();
        List<TrMapInitReq.Item> items = req.items() == null ? List.of() : req.items();
        for (Long companyId : companyIds) {
            for (TrMapInitReq.Item item : items) {
                mapper.deleteByJournalGroup(companyId, item.trCode(), item.journalGroup());
                mapper.insertInitData(companyId, item.trCode(), item.journalGroup());
                journalMapper.deleteByJournalGroup(companyId, item.journalGroup());
                journalMapper.insertInitData(companyId, item.journalGroup());
            }
        }
        return companyIds.size();
    }

    private static String likeText(String s) {
        return s == null || s.isEmpty() ? "%" : "%" + s + "%";
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }
}
