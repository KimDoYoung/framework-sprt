package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDepositRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDepositSaveReq;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFeeDepositMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/icam/Icam11_FeeDeposit.java (selectByCompanyId L21, selectByFundCode2 L26, update L31, delete L36).
 * 회사는 로그인 회사로 고정한다(원본도 LoginUser.getCompanyId()).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamFeeDepositService {

    private final IcamFeeDepositMapper mapper;

    /** corpId가 없으면 "%"(전체 운용사), 검색어는 비어 있어도 된다 */
    public List<IcamFeeDepositRes> search(UserPrincipal user, Long corpId, String searchText) {
        return mapper.selectByCompanyId(user.getCompanyId(), corpId == null ? "%" : String.valueOf(corpId), searchText == null ? "" : searchText);
    }

    public List<IcamFeeDepositRes> searchByFund(UserPrincipal user, String icamCompanyCode, String fundCode) {
        return mapper.selectByFundCode2(user.getCompanyId(), icamCompanyCode, fundCode);
    }

    /** UpdateDataModel — feeDepositId 0 이하는 INSERT, 아니면 UPDATE. 저장한 행을 요청 순서대로 돌려준다 */
    @Transactional
    public List<IcamFeeDepositRes> save(UserPrincipal user, List<IcamFeeDepositSaveReq.Item> items) {
        List<IcamFeeDepositRes> out = new ArrayList<>();
        if (items == null) return out;
        for (IcamFeeDepositSaveReq.Item r : items) {
            Long id = r.feeDepositId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertFeeDeposit(id, user.getCompanyId(), r);
            } else if (mapper.updateFeeDeposit(user.getCompanyId(), r) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            out.add(mapper.selectById(user.getCompanyId(), id));
        }
        return out;
    }

    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return mapper.deleteFeeDeposits(user.getCompanyId(), ids);
    }
}
