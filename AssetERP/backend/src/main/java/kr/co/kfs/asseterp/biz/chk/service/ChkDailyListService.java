package kr.co.kfs.asseterp.biz.chk.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListCopyReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListSaveReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListUseYnReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteGroupReq;
import kr.co.kfs.asseterp.biz.chk.mapper.ChkDailyListMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * AS-IS Chk02_Tab_DailyListAdmin·Chk02_Tab_DailyList(R01)·Chk02_Lookup_UseYn·Chk02_Edit_DailyList → server/chk/Chk02_DailyList.java
 * (selectByAdmin L27 / insert L117 / modelUpdate L148 / delete L166). 저장·삭제는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChkDailyListService {

    private final ChkDailyListMapper mapper;

    /** AS-IS selectByAdmin: useYn 비면 전체(`%`), 검색어는 `%…%` */
    public List<ChkDailyListRes> search(UserPrincipal user, Long classTreeId, String useYn, String searchText) {
        String yn = useYn == null || useYn.isBlank() ? "%" : useYn;
        return mapper.selectByAdmin(user.getCompanyId(), classTreeId, yn, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectBySearchText2(Chk02_Lookup_UseYn): 사용여부 조건 없이 전체, 검색어는 `%…%` */
    public List<ChkDailyListRes> searchAll(UserPrincipal user, Long classTreeId, String searchText) {
        return mapper.selectBySearchText2(user.getCompanyId(), classTreeId, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS updateUseYn: 바꾼 행마다 로그인 회사의 사용여부 갱신 → 처리 건수 */
    @Transactional
    public int updateUseYn(UserPrincipal user, ChkDailyListUseYnReq req) {
        if (req == null || req.items() == null) return 0;
        int done = 0;
        for (ChkDailyListUseYnReq.Item item : req.items()) {
            done += mapper.updateUseYn(user.getCompanyId(), item.dailyListId(), item.useYn());
        }
        return done;
    }

    /** AS-IS updateWriteGroupId: 고른 행들에 담당그룹(null = 작성그룹없음) 지정 → 처리 건수 */
    @Transactional
    public int updateWriteGroup(UserPrincipal user, ChkDailyListWriteGroupReq req) {
        if (req == null || req.dailyListIds() == null) return 0;
        int done = 0;
        for (Long id : req.dailyListIds()) {
            done += mapper.updateWriteGroupId(user.getCompanyId(), id, req.writeGroupId());
        }
        return done;
    }

    /** AS-IS modelUpdate 새 행: id는 원본이 서버에서 getSeq — 저장 후 읽은 행을 돌려준다 */
    @Transactional
    public ChkDailyListRes create(UserPrincipal user, ChkDailyListSaveReq req) {
        validate(req);
        long id = mapper.selectNextId();
        mapper.insert(user.getCompanyId(), id, req);
        return mapper.selectById(id);
    }

    /** AS-IS modelUpdate 수정. 로그인 회사 행이 아니면 없는 행으로 본다 */
    @Transactional
    public ChkDailyListRes update(UserPrincipal user, Long dailyListId, ChkDailyListSaveReq req) {
        validate(req);
        if (mapper.update(user.getCompanyId(), dailyListId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(dailyListId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel): 체크한 행 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> dailyListIds) {
        if (dailyListIds == null || dailyListIds.isEmpty()) return 0;
        return mapper.deleteByIds(user.getCompanyId(), dailyListIds);
    }

    /**
     * AS-IS insert(점검내역복사): 고른 고객사마다 선택한 점검내역을 복사 — 이미 복사된 행(adminDailyListId 같음)이 있으면 updateFromAdmin, 없으면 insertFromAdmin.
     * 원본이 화면에서 받던 분류·내용·설명은 서버가 로그인 회사의 그 행에서 읽는다. updateFromAdmin의 조건(대상 회사 + 관리자 행 id)은 원본 그대로라 복사본의 id와 달라 갱신되지 않는다
     * (원본 동작, 제안은 작업기록). 돌려주는 값은 (고객사 × 점검내역) 처리 수
     */
    @Transactional
    public int copy(UserPrincipal user, ChkDailyListCopyReq req) {
        if (req == null || req.dailyListIds() == null || req.companyIds() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        List<ChkDailyListRes> rows = req.dailyListIds().stream()
                .map(mapper::selectById)
                .filter(r -> r != null && Objects.equals(r.companyId(), user.getCompanyId()))
                .toList();
        int done = 0;
        for (Long companyId : req.companyIds()) {
            for (ChkDailyListRes row : rows) {
                if (mapper.countByAdminDailyListId(companyId, row.dailyListId()) > 0) {
                    mapper.updateFromAdmin(companyId, row.dailyListId(), row.classTreeId(), row.content(), row.explan());
                } else {
                    mapper.insertFromAdmin(companyId, row.dailyListId());
                }
                done++;
            }
        }
        return done;
    }

    /** AS-IS Chk02_Edit_DailyList.update() 검사 (화면이 막지만 서버도 확인) */
    private void validate(ChkDailyListSaveReq req) {
        if (req.classTreeId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "분류는 필수선택 항목입니다");
        if (req.content() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "체크대상은 필수입력 항목입니다");
    }
}
