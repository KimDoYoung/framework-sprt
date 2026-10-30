package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountMapRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountMapSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardUseItemRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizAccountMapMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS Biz03_Lookup_AccountMap → server/biz/Biz03_AccountMap.java (selectByUseItemCode L23 / update L32 / delete L37) + sys.Sys09_Code.selectByCodeKind */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizAccountMapService {

    private final BizAccountMapMapper mapper;

    public List<BizCardUseItemRes> searchUseItems(UserPrincipal user) {
        return mapper.selectUseItems(user.getCompanyId(), LocalDate.now());
    }

    public List<BizAccountMapRes> searchByUseItemCode(UserPrincipal user, String useItemCode) {
        return mapper.selectByUseItemCode(user.getCompanyId(), useItemCode);
    }

    /** UpdateDataModel.updateModel — 0 이하 ID는 INSERT(새 ID), 그 밖은 UPDATE. 저장한 건수 */
    @Transactional
    public int save(UserPrincipal user, List<BizAccountMapSaveReq> rows) {
        int count = 0;
        for (BizAccountMapSaveReq row : rows) {
            if (row.useItemCode() == null || row.accountCodeId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            if (row.accountMapId() == null || row.accountMapId() <= 0) {
                count += mapper.insertAccountMap(mapper.selectNextId(), user.getCompanyId(), row);
            } else {
                count += mapper.updateAccountMap(user.getCompanyId(), row);
            }
        }
        return count;
    }

    @Transactional
    public int delete(UserPrincipal user, List<Long> accountMapIds) {
        if (accountMapIds == null || accountMapIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteAccountMaps(user.getCompanyId(), accountMapIds);
    }
}
