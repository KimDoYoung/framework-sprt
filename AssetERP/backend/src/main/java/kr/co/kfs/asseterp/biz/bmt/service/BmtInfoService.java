package kr.co.kfs.asseterp.biz.bmt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtInfoRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtInfoSaveReq;
import kr.co.kfs.asseterp.biz.bmt.mapper.BmtInfoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS Bmt10_Tab_Info·Bmt10_Edit_Info → server/bmt/Bmt10_Info.java (selectByCompanyId L25 / modelUpdate L35 / modelDelete L49) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BmtInfoService {

    private final BmtInfoMapper mapper;

    /** AS-IS selectByCompanyId(companyId, itemClassCode "%"=전체, baseDate, checkYn, searchText) — searchText는 서버가 %…%로 감싼다 */
    public List<BmtInfoRes> search(UserPrincipal user, String itemClassCode, LocalDate baseDate, boolean checkYn, String searchText) {
        String code = (itemClassCode == null || itemClassCode.isEmpty()) ? "%" : itemClassCode;
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByCompanyId(user.getCompanyId(), code, baseDate, checkYn, text);
    }

    /** AS-IS selectByBaseDate(infoId, baseDate) — 수정·이력 창을 닫은 뒤 그 행만 다시 읽기 */
    public BmtInfoRes get(UserPrincipal user, Long infoId, LocalDate baseDate) {
        BmtInfoRes row = mapper.selectByBaseDate(user.getCompanyId(), infoId, baseDate);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /** AS-IS modelUpdate (infoId 없음) → 새 ID(dbConfig.getSeq)·로그인 회사로 INSERT */
    @Transactional
    public Long create(UserPrincipal user, BmtInfoSaveReq req) {
        check(req);
        long infoId = mapper.selectNextId();
        mapper.insert(infoId, user.getCompanyId(), req);
        return infoId;
    }

    /** AS-IS modelUpdate (infoId 있음) → UPDATE */
    @Transactional
    public Long update(UserPrincipal user, Long infoId, BmtInfoSaveReq req) {
        check(req);
        if (mapper.update(user.getCompanyId(), infoId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return infoId;
    }

    /** AS-IS modelDelete → UpdateDataModel.deleteModel */
    @Transactional
    public void delete(UserPrincipal user, Long infoId) {
        if (mapper.delete(user.getCompanyId(), infoId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private void check(BmtInfoSaveReq req) {
        if (req.astClassTreeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "장비명을 선택해주세요.");
        }
    }
}
